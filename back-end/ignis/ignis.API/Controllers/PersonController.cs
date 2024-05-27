using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly ILogger<PersonController> _logger;
        private readonly DataContext _context;
#if DEBUG
        static string Media_Root_Folder = "../../media";
#elif RELEASE
        static string Media_Root_Folder = "media";
#endif
        static string Person_Root_Folder = Media_Root_Folder + "/person";

        public PersonController(ILogger<PersonController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddPerson([FromForm] AddPersonRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.Person.Any(p => p.Name == request.name))
            {
                return BadRequest("Person already exists.");
            }

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            Person person = new Person()
            {
                PersonId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                Name = request.name,
                Email = request.email,
                Group = request.group,
                SubGroups = new List<string>(),
                Company = request.company,
                Role = request.role,
                Notes = request.notes,
                FaceUrls = new List<string>(),
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                Creator = creator
            };

            HttpClient _clientFaceMe;
            HttpResponseMessage _response;

            HttpClientHandler handlerFaceMe = new HttpClientHandler();
            _clientFaceMe = new HttpClient(handlerFaceMe);
            _clientFaceMe.BaseAddress = new Uri("http://localhost:8080/");

            string? faceMeToken = null;

            _logger.LogInformation($"POST api/website/account/signIn");
            FormUrlEncodedContent faceMeAuthenticationContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "account", "AdMin" },
                { "password", "Admin123" },
                { "expiryDay", "" }
            });
            _response = await _clientFaceMe.PostAsync($"api/website/account/signIn", faceMeAuthenticationContent);

            if (_response.IsSuccessStatusCode)
            {
                FaceMeAuthenticationResponse? faceMeAuthenticationResponse = JsonConvert.DeserializeObject<FaceMeAuthenticationResponse>(await _response.Content.ReadAsStringAsync());

                if (faceMeAuthenticationResponse != null)
                {
                    faceMeToken = faceMeAuthenticationResponse.token;
                }
            }
            else
            {
                _logger.LogError($"Error accessing API : {_response.StatusCode}");
            }

            _clientFaceMe.DefaultRequestHeaders.Add("Authorization", faceMeToken);

            long? groupId = null;

            _logger.LogInformation($"POST api/website/group/list");
            FormUrlEncodedContent faceMeListGroupContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "type", "" },
                { "pageIndex", "" },
                { "pageSize", "" },
                { "orderBy", "" }
            });
            _response = await _clientFaceMe.PostAsync($"api/website/group/list", faceMeListGroupContent);

            if (_response.IsSuccessStatusCode)
            {
                FaceMeListGroupResponse? faceMeListGroupResponse = JsonConvert.DeserializeObject<FaceMeListGroupResponse>(await _response.Content.ReadAsStringAsync());

                if (faceMeListGroupResponse != null)
                {
                    foreach (FaceMeListGroupResultResponse faceMeListGroupResultResponse in faceMeListGroupResponse.results)
                    {
                        if (faceMeListGroupResultResponse.type == person.Group)
                        {
                            groupId = faceMeListGroupResultResponse.groupId;

                            break;
                        }
                    }
                }
            }
            else
            {
                _logger.LogError($"Error accessing API : {_response.StatusCode}");
            }

            int? personNumber = null;

            _logger.LogInformation($"POST api/website/person/import");
            FaceMeImportPersonEnrollInformationRequest faceMeImportPersonEnrollInformationRequest = new FaceMeImportPersonEnrollInformationRequest
            {
                email = person.Email,
                company = person.Company,
                title = person.Role,
                note = person.Notes
            };
            MultipartFormDataContent faceMeImportPersonEnrollContent = new MultipartFormDataContent
            {
                { new StringContent(person.Name), "name" },
                { new StringContent(person.PersonId), "employeeId" },
                { new StringContent(JsonConvert.SerializeObject(faceMeImportPersonEnrollInformationRequest), Encoding.UTF8, "application/json"), "information" },
                { new StringContent(groupId.ToString()), "groupId" },
                { new StringContent(false.ToString()), "skipQC" }
            };

            if (request.profilePictureFile != null)
            {
                faceMeImportPersonEnrollContent.Add(new StreamContent(request.profilePictureFile.OpenReadStream()), "coverImage", request.profilePictureFile.FileName);
            }

            foreach (IFormFile faceFile in request.faceFiles)
            {
                faceMeImportPersonEnrollContent.Add(new StreamContent(faceFile.OpenReadStream()), "snapshot", faceFile.FileName);
            }

            _response = await _clientFaceMe.PostAsync($"api/website/person/import", faceMeImportPersonEnrollContent);

            if (_response.IsSuccessStatusCode)
            {
                FaceMeImportPersonEnrollResponse? faceMeImportPersonEnrollResponse = JsonConvert.DeserializeObject<FaceMeImportPersonEnrollResponse>(await _response.Content.ReadAsStringAsync());

                if (faceMeImportPersonEnrollResponse != null)
                {
                    personNumber = (int)faceMeImportPersonEnrollResponse.personId;
                }
            }
            else
            {
                //_logger.LogError($"Error accessing API : {_response.StatusCode}");
                _logger.LogError($"Error accessing API : {await _response.Content.ReadAsStringAsync()}");

                return BadRequest(await _response.Content.ReadAsStringAsync());
            }

            person.PersonNumber = (int)personNumber;

            string personDirectory = $"{Person_Root_Folder}/{person.PersonId}";

            if (!Directory.Exists(personDirectory))
            {
                Directory.CreateDirectory(personDirectory);
            }

            if (request.profilePictureFile != null)
            {
                person.ProfilePictureUrl = $"{personDirectory}/{person.PersonId}{Path.GetExtension(request.profilePictureFile.FileName)}";

                using (FileStream stream = new FileStream(person.ProfilePictureUrl, FileMode.Create))
                {
                    request.profilePictureFile.CopyTo(stream);
                }
            }

            for (int i = 0; i < request.faceFiles.Count; i++)
            {
                string faceUrl = $"{personDirectory}/{person.PersonId}_{i}{Path.GetExtension(request.faceFiles[i].FileName)}";

                person.FaceUrls.Add(faceUrl);

                using (FileStream stream = new FileStream(faceUrl, FileMode.Create))
                {
                    request.faceFiles[i].CopyTo(stream);
                }
            }

            _context.Person.Add(person);

            await _context.SaveChangesAsync();

            return Ok("Person added.");
        }

        [HttpGet("group/list")]
        public async Task<ActionResult> GetPersonGroupList()
        {
            HttpClient _clientFaceMe;
            HttpResponseMessage _response;

            HttpClientHandler handlerFaceMe = new HttpClientHandler();
            _clientFaceMe = new HttpClient(handlerFaceMe);
            _clientFaceMe.BaseAddress = new Uri("http://localhost:8080/");

            string? faceMeToken = null;

            _logger.LogInformation($"POST api/website/account/signIn");
            FormUrlEncodedContent faceMeAuthenticationContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "account", "AdMin" },
                { "password", "Admin123" },
                { "expiryDay", "" }
            });
            _response = await _clientFaceMe.PostAsync($"api/website/account/signIn", faceMeAuthenticationContent);

            if (_response.IsSuccessStatusCode)
            {
                FaceMeAuthenticationResponse? faceMeAuthenticationResponse = JsonConvert.DeserializeObject<FaceMeAuthenticationResponse>(await _response.Content.ReadAsStringAsync());

                if (faceMeAuthenticationResponse != null)
                {
                    faceMeToken = faceMeAuthenticationResponse.token;
                }
            }
            else
            {
                _logger.LogError($"Error accessing API : {_response.StatusCode}");
            }

            _clientFaceMe.DefaultRequestHeaders.Add("Authorization", faceMeToken);

            List<string> groups = new List<string>();

            _logger.LogInformation($"POST api/website/group/list");
            FormUrlEncodedContent faceMeListGroupContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "type", "" },
                { "pageIndex", "" },
                { "pageSize", "" },
                { "orderBy", "" }
            });
            _response = await _clientFaceMe.PostAsync($"api/website/group/list", faceMeListGroupContent);

            if (_response.IsSuccessStatusCode)
            {
                FaceMeListGroupResponse? faceMeListGroupResponse = JsonConvert.DeserializeObject<FaceMeListGroupResponse>(await _response.Content.ReadAsStringAsync());

                if (faceMeListGroupResponse != null)
                {
                    foreach (FaceMeListGroupResultResponse faceMeListGroupResultResponse in faceMeListGroupResponse.results)
                    {
                        groups.Add(faceMeListGroupResultResponse.type);
                    }
                }
            }
            else
            {
                _logger.LogError($"Error accessing API : {_response.StatusCode}");
            }

            return Ok(groups);
        }

        [HttpGet("list")]
        public async Task<ActionResult> GetPersonList()
        {
            List<Person> people = await _context.Person.OrderBy(p => p.Name).ToListAsync();

            for (int i = 0; i < people.Count; i++)
            {
                people[i].ProfilePictureUrl = people[i].ProfilePictureUrl != null ? $"api/media/image/{people[i].ProfilePictureUrl.Substring(Media_Root_Folder.Length + 1).Replace("/", "%5C")}" : null;

                for (int j = 0; j < people[i].FaceUrls.Count; j++)
                {
                    people[i].FaceUrls[j] = $"api/media/image/{people[i].FaceUrls[j].Substring(Media_Root_Folder.Length + 1).Replace("/", "%5C")}";
                }
            }

            return Ok(people);
        }
    }
}