using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using ignis.Infrastructure.Persistence;
using Newtonsoft.Json;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Subscriptions;
using Serilog.Sinks.NewRelic.Logs.Sinks.NewRelicLogs;
using System.Net.Http.Headers;
using System.Text;

namespace ignis.NxService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        static HttpClient _client;
        static HttpClient _clientNx;
        static string Nx_Type = "Nx Meta";
        static int? Nx_API_Port = Nx_Type == "Nx Witness" ? 7001 : Nx_Type == "Nx Meta" ? 7011 : null;
        static string Nx_Video_Format = "mkv";
        static string nxDeviceToGetRecording_SubscriptionName = "NxDeviceToGetRecording_Subscription";
        static User systemAdmin = new User();

        public class GetNxDeviceRecordingGlobalVariable
        {
            public bool startFlag { get; set; } = false;
            public bool stopFlag { get; set; } = false;
            public string? nxDeviceId { get; set; } = null;
            public string? evidenceSourceId { get; set; } = null;
            public string? name { get; set; } = null;
            public string? nxServerId { get; set; } = null;
            public string? nxCameraId { get; set; } = null;
            public long? lastCheckedAt { get; set; } = null;
            public bool? includePastRecordings { get; set; } = null;
        }

        static List<GetNxDeviceRecordingGlobalVariable> getNxDeviceRecordingGlobalVariables = new List<GetNxDeviceRecordingGlobalVariable>();

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;

            HttpClientHandler handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            _client = new HttpClient(handler);
            // _client.BaseAddress = new Uri("https://localhost:5001/");
            _client.BaseAddress = new Uri("http://localhost:5000/");

            HttpClientHandler handlerNx = new HttpClientHandler();
            handlerNx.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            _clientNx = new HttpClient(handlerNx);
            _clientNx.BaseAddress = new Uri($"https://localhost:{Nx_API_Port}/");
            _clientNx.Timeout = TimeSpan.FromSeconds(3600);
        }

        async void GetNxDeviceRecording(object idObj)
        {
            int i = (int)idObj;

            _logger.LogInformation($"Get nx device recording channel {i} is ready");

            HttpResponseMessage _response;

            while (!getNxDeviceRecordingGlobalVariables[i].stopFlag)
            {
                while (!getNxDeviceRecordingGlobalVariables[i].startFlag)
                {
                    await Task.Delay(1000);
                }

                EvidenceSource evidenceSource = new EvidenceSource();
                
                _logger.LogInformation($"GET api/evidence/source?evidenceSourceId={getNxDeviceRecordingGlobalVariables[i].evidenceSourceId}");
                _response = await _client.GetAsync($"api/evidence/source?evidenceSourceId={getNxDeviceRecordingGlobalVariables[i].evidenceSourceId}");

                if (_response.IsSuccessStatusCode)
                {
                    evidenceSource = JsonConvert.DeserializeObject<EvidenceSource>(await _response.Content.ReadAsStringAsync());
                }
                else
                {
                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                }

                DateTime dateTime = DateTime.UtcNow;

                _logger.LogInformation($"GET ec2/recordedTimePeriods?cameraId={getNxDeviceRecordingGlobalVariables[i].nxCameraId}&startTime={getNxDeviceRecordingGlobalVariables[i].lastCheckedAt}");
                _response = await _clientNx.GetAsync($"ec2/recordedTimePeriods?cameraId={getNxDeviceRecordingGlobalVariables[i].nxCameraId}&startTime={getNxDeviceRecordingGlobalVariables[i].lastCheckedAt}");

                if (_response.IsSuccessStatusCode)
                {
                    NxRecordedTimePeriodResponse? nxRecordedTimePeriodResponse = JsonConvert.DeserializeObject<NxRecordedTimePeriodResponse>(await _response.Content.ReadAsStringAsync());

                    if (nxRecordedTimePeriodResponse != null)
                    {
                        foreach (Reply nxRecordedTimePeriodResponseReply in nxRecordedTimePeriodResponse.reply)
                        {
                            if (nxRecordedTimePeriodResponseReply.guid == $"{{{getNxDeviceRecordingGlobalVariables[i].nxServerId}}}")
                            {
                                foreach (Period nxRecordedTimePeriodResponseReplyPeriod in nxRecordedTimePeriodResponseReply.periods)
                                {
                                    if (nxRecordedTimePeriodResponseReplyPeriod.durationMs == "-1")
                                    {
                                        if (evidenceSource.Name == "CCTV")
                                        {
                                            if (getNxDeviceRecordingGlobalVariables[i].lastCheckedAt != null)
                                            {
                                                if (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs) < getNxDeviceRecordingGlobalVariables[i].lastCheckedAt)
                                                {
                                                    nxRecordedTimePeriodResponseReplyPeriod.startTimeMs = getNxDeviceRecordingGlobalVariables[i].lastCheckedAt.ToString();
                                                }
                                            }

                                            nxRecordedTimePeriodResponseReplyPeriod.durationMs = (dateTime.ToUnixTimestamp() - long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs)).ToString();

                                            if (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs) < 60000)
                                            {
                                                continue;
                                            }
                                        }
                                        else
                                        {
                                            continue;
                                        }
                                    }
                                    else if (evidenceSource.Name == "CCTV")
                                    {
                                        if (getNxDeviceRecordingGlobalVariables[i].lastCheckedAt != null)
                                        {
                                            if (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs) < getNxDeviceRecordingGlobalVariables[i].lastCheckedAt)
                                            {
                                                nxRecordedTimePeriodResponseReplyPeriod.durationMs = (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs) - (getNxDeviceRecordingGlobalVariables[i].lastCheckedAt - long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs))).ToString();
                                                nxRecordedTimePeriodResponseReplyPeriod.startTimeMs = getNxDeviceRecordingGlobalVariables[i].lastCheckedAt.ToString();
                                            }
                                        }
                                    }
                                    else if (getNxDeviceRecordingGlobalVariables[i].includePastRecordings == false)
                                    {
                                        if (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs) < getNxDeviceRecordingGlobalVariables[i].lastCheckedAt)
                                        {
                                            nxRecordedTimePeriodResponseReplyPeriod.durationMs = (long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs) - (getNxDeviceRecordingGlobalVariables[i].lastCheckedAt - long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs))).ToString();
                                            nxRecordedTimePeriodResponseReplyPeriod.startTimeMs = getNxDeviceRecordingGlobalVariables[i].lastCheckedAt.ToString();
                                        }
                                    }

                                    string fileName = $"{getNxDeviceRecordingGlobalVariables[i].name}_{DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs)).LocalDateTime.ToString("yyyyMMddHHmmss")}_{DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs) + long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs)).LocalDateTime.ToString("yyyyMMddHHmmss")}.{Nx_Video_Format}";
                                    int duration = (int)Math.Ceiling(long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs) / 1000.0);

                                    _logger.LogInformation($"POST api/evidence/videofootage/add");
                                    MultipartFormDataContent addVideoFootageContent = new MultipartFormDataContent
                                    {
                                        { new StringContent(systemAdmin.UserId), "creatorUserId" },
                                        { new StringContent(evidenceSource.EvidenceSourceId), "evidenceSourceId" },
                                        { new StringContent(fileName), "name" },
                                        { new StringContent(new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs)).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")), "recordingStartedAt" }
                                    };

                                    _response = await _client.PostAsync($"api/evidence/videofootage/add", addVideoFootageContent);

                                    if (_response.IsSuccessStatusCode)
                                    {
                                        string videoFootageId = await _response.Content.ReadAsStringAsync();

                                        _logger.LogInformation($"GET hls/{getNxDeviceRecordingGlobalVariables[i].nxCameraId}.{Nx_Video_Format}?pos={nxRecordedTimePeriodResponseReplyPeriod.startTimeMs}&duration={duration}");
                                        _response = await _clientNx.GetAsync($"hls/{getNxDeviceRecordingGlobalVariables[i].nxCameraId}.{Nx_Video_Format}?pos={nxRecordedTimePeriodResponseReplyPeriod.startTimeMs}&duration={duration}");

                                        if (_response.IsSuccessStatusCode)
                                        {
                                            using (Stream file = await _response.Content.ReadAsStreamAsync())
                                            {
                                                _logger.LogInformation($"PUT api/evidence/videofootage/updatefile");
                                                MultipartFormDataContent updateFileVideoFootageContent = new MultipartFormDataContent
                                                {
                                                    { new StringContent(videoFootageId), "videoFootageId" },
                                                    { new StringContent(nxRecordedTimePeriodResponseReplyPeriod.durationMs), "duration" },
                                                    { new StreamContent(file), "file", fileName }
                                                };

                                                _response = await _client.PutAsync($"api/evidence/videofootage/updatefile", updateFileVideoFootageContent);

                                                if (!_response.IsSuccessStatusCode)
                                                {
                                                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                                }
                                            }

                                            getNxDeviceRecordingGlobalVariables[i].lastCheckedAt = long.Parse(nxRecordedTimePeriodResponseReplyPeriod.startTimeMs) + long.Parse(nxRecordedTimePeriodResponseReplyPeriod.durationMs);
                                            getNxDeviceRecordingGlobalVariables[i].includePastRecordings = true;
                                        }
                                        else
                                        {
                                            _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                        }
                                    }
                                    else
                                    {
                                        _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                    }
                                }

                                break;
                            }
                        }
                    }
                }
                else
                {
                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                }

                _logger.LogInformation($"PUT api/device/nxdevice/updateischecking");
                UpdateIsCheckingNxDeviceRequest updateIsCheckingNxDeviceRequest = new UpdateIsCheckingNxDeviceRequest
                {
                    nxDeviceId = getNxDeviceRecordingGlobalVariables[i].nxDeviceId,
                    isChecking = false,
                    lastCheckedAt = getNxDeviceRecordingGlobalVariables[i].lastCheckedAt
                };
                StringContent updateIsCheckingNxDeviceContent = new StringContent(JsonConvert.SerializeObject(updateIsCheckingNxDeviceRequest), Encoding.UTF8, "application/json");
                _response = await _client.PutAsync($"api/device/nxdevice/updateischecking", updateIsCheckingNxDeviceContent);

                if (!_response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                }

                _logger.LogInformation("Get nx device recording finished");

                getNxDeviceRecordingGlobalVariables[i].startFlag = false;
                getNxDeviceRecordingGlobalVariables[i].nxDeviceId = null;
                getNxDeviceRecordingGlobalVariables[i].evidenceSourceId = null;
                getNxDeviceRecordingGlobalVariables[i].name = null;
                getNxDeviceRecordingGlobalVariables[i].nxServerId = null;
                getNxDeviceRecordingGlobalVariables[i].nxCameraId = null;
                getNxDeviceRecordingGlobalVariables[i].lastCheckedAt = null;
                getNxDeviceRecordingGlobalVariables[i].includePastRecordings = null;
            }

            _logger.LogInformation($"Get nx device recording channel {i} is stopped");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _logger.LogInformation("Initialization");
                HttpResponseMessage _response;

                _logger.LogInformation($"GET api/user/systemadmin");
                _response = await _client.GetAsync($"api/user/systemadmin");

                if (_response.IsSuccessStatusCode)
                {
                    systemAdmin = JsonConvert.DeserializeObject<User>(await _response.Content.ReadAsStringAsync());
                }
                else
                {
                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                }

                _logger.LogInformation($"GET api/device/nxdevice/list?isChecking=true");
                _response = await _client.GetAsync($"api/device/nxdevice/list?isChecking=true");

                if (_response.IsSuccessStatusCode)
                {
                    List<NxDevice> nxDevices = JsonConvert.DeserializeObject<List<NxDevice>>(await _response.Content.ReadAsStringAsync());

                    foreach (NxDevice nxDevice in nxDevices)
                    {
                        _logger.LogInformation($"PUT api/device/nxdevice/updateischecking");
                        UpdateIsCheckingNxDeviceRequest updateIsCheckingNxDeviceRequest = new UpdateIsCheckingNxDeviceRequest
                        {
                            nxDeviceId = nxDevice.NxDeviceId,
                            isChecking = false,
                            lastCheckedAt = nxDevice.LastCheckedAt
                        };
                        StringContent updateIsCheckingNxDeviceContent = new StringContent(JsonConvert.SerializeObject(updateIsCheckingNxDeviceRequest), Encoding.UTF8, "application/json");
                        _response = await _client.PutAsync($"api/device/nxdevice/updateischecking", updateIsCheckingNxDeviceContent);

                        if (!_response.IsSuccessStatusCode)
                        {
                            _logger.LogError($"Error accessing API : {_response.StatusCode}");
                        }
                    }
                }
                else
                {
                    _logger.LogError($"Error accessing API : {_response.StatusCode}");
                }

                // Setup Channel 1
                getNxDeviceRecordingGlobalVariables.Add(new GetNxDeviceRecordingGlobalVariable());
                Thread getNxDeviceRecordingCh1 = new Thread(new ParameterizedThreadStart(GetNxDeviceRecording));
                getNxDeviceRecordingCh1.Start(0);

                //// Setup Channel 2
                //getNxDeviceRecordingGlobalVariables.Add(new GetNxDeviceRecordingGlobalVariable());
                //Thread getNxDeviceRecordingCh2 = new Thread(new ParameterizedThreadStart(GetNxDeviceRecording));
                //getNxDeviceRecordingCh2.Start(1);

                SubscriptionWorker<NxDevice> nxDeviceToGetRecording_SubscriptionWorker = DocumentStoreHolder.Store.Subscriptions.GetSubscriptionWorker<NxDevice>(nxDeviceToGetRecording_SubscriptionName);

                await nxDeviceToGetRecording_SubscriptionWorker.Run(async batch =>
                {
                    using (IAsyncDocumentSession session = batch.OpenAsyncSession())
                    {
                        foreach (NxDevice nxDevice in batch.Items.Select(x => x.Result))
                        {
                            string? nxToken = null;

                            while (true)
                            {
                                bool nxDeviceIsChecking = false;

                                for (int i = 0; i < getNxDeviceRecordingGlobalVariables.Count; i++)
                                {
                                    if (!getNxDeviceRecordingGlobalVariables[i].startFlag)
                                    {
                                        getNxDeviceRecordingGlobalVariables[i].nxDeviceId = nxDevice.NxDeviceId;
                                        getNxDeviceRecordingGlobalVariables[i].evidenceSourceId = nxDevice.EvidenceSourceId;
                                        getNxDeviceRecordingGlobalVariables[i].name = nxDevice.Name;
                                        getNxDeviceRecordingGlobalVariables[i].nxServerId = nxDevice.NxServerId;
                                        getNxDeviceRecordingGlobalVariables[i].nxCameraId = nxDevice.NxCameraId;
                                        getNxDeviceRecordingGlobalVariables[i].lastCheckedAt = nxDevice.LastCheckedAt;
                                        getNxDeviceRecordingGlobalVariables[i].includePastRecordings = nxDevice.LastCheckedAt == nxDevice.CreatedAt.ToUnixTimestamp() ? false : true;

                                        _logger.LogInformation($"POST rest/v2/login/sessions");
                                        NxLoginRequest nxLoginRequest = new NxLoginRequest
                                        {
                                            username = "admin",
                                            password = "Admin123"
                                        };
                                        StringContent nxLoginContent = new StringContent(JsonConvert.SerializeObject(nxLoginRequest), Encoding.UTF8, "application/json");
                                        _response = await _clientNx.PostAsync($"rest/v2/login/sessions", nxLoginContent);

                                        if (_response.IsSuccessStatusCode)
                                        {
                                            NxLoginResponse? nxLoginResponse = JsonConvert.DeserializeObject<NxLoginResponse>(await _response.Content.ReadAsStringAsync());

                                            if (nxLoginResponse != null)
                                            {
                                                nxToken = nxLoginResponse.token;
                                            }
                                        }
                                        else
                                        {
                                            _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                        }

                                        _clientNx.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", nxToken);

                                        _logger.LogInformation($"PUT api/device/nxdevice/updateischecking");
                                        UpdateIsCheckingNxDeviceRequest updateIsCheckingNxDeviceRequest = new UpdateIsCheckingNxDeviceRequest
                                        {
                                            nxDeviceId = getNxDeviceRecordingGlobalVariables[i].nxDeviceId,
                                            isChecking = true,
                                            lastCheckedAt = getNxDeviceRecordingGlobalVariables[i].lastCheckedAt
                                        };
                                        StringContent updateIsCheckingNxDeviceContent = new StringContent(JsonConvert.SerializeObject(updateIsCheckingNxDeviceRequest), Encoding.UTF8, "application/json");
                                        _response = await _client.PutAsync($"api/device/nxdevice/updateischecking", updateIsCheckingNxDeviceContent);

                                        if (!_response.IsSuccessStatusCode)
                                        {
                                            _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                        }

                                        getNxDeviceRecordingGlobalVariables[i].startFlag = true;
                                        _logger.LogInformation("Get nx device recording started");

                                        nxDeviceIsChecking = true;

                                        break;
                                    }
                                }

                                if (nxDeviceIsChecking)
                                {
                                    break;
                                }

                                await Task.Delay(1000, stoppingToken);
                            }
                        }
                    }
                }, stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, stoppingToken);
                }

                foreach (GetNxDeviceRecordingGlobalVariable getNxDeviceRecordingGlobalVariable in getNxDeviceRecordingGlobalVariables)
                {
                    getNxDeviceRecordingGlobalVariable.stopFlag = true;
                }

                getNxDeviceRecordingCh1.Join();
                //getNxDeviceRecordingCh2.Join();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong: {ex}");
            }
        }
    }
}