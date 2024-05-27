using Newtonsoft.Json;
using System.Text;
using System.Diagnostics;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using Serilog;
using System.Globalization;
using ignis.Domain.Model.RavenDB;
using ignis.Infrastructure.Persistence;
using Raven.Client.Documents.Subscriptions;
using Raven.Client.Documents.Session;
using ignis.Domain.Model.PostgreSQL;

namespace ignis.Service
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        static HttpClient _client;
        static HttpClient _clientMediaMTX;
        static HttpClient _clientFaceMe;
        static string MediaMTX_CH1_Path = "video/live/channel1";
        static string MediaMTX_CH2_Path = "video/live/channel2";
        static string MediaMTX_CH3_Path = "video/live/channel3";
        static string MediaMTX_CH4_Path = "video/live/channel4";
#if DEBUG
        static string Parent_Directory = "../../";
#elif RELEASE
        static string Parent_Directory = "";
#endif
        static string MediaMTX_Root_Folder = $"{Parent_Directory}mediamtx";
        static string Evidence_Root_Folder = $"{Parent_Directory}Evidence";
        static string videoFootageToCompress_SubscriptionName = "VideoFootageToCompress_Subscription";
        static string videoFootageToAnalyze_SubscriptionName = "VideoFootageToAnalyze_Subscription";
        static User systemAdmin = new User();
        static string[] videoFootageFileSupportFormats = { ".mp4", ".mkv" };

        public class CompressVideoFootageGlobalVariable
        {
            public bool startFlag { get; set; } = false;
            public bool stopFlag { get; set; } = false;
            public string? videoFootageId { get; set; } = null;
            public string? originalVideoUrl { get; set; } = null;
        }

        public class AnalyzeVideoFootageGlobalVariable
        {
            public string mediaMTXCHPath { get; set; }
            public bool startFlag { get; set; } = false;
            public bool finishFlag { get; set; } = false;
            public bool stopFlag { get; set; } = false;
            public string? videoFootageId { get; set; } = null;
            public string? originalVideoUrl { get; set; } = null;
            public float? analysisSpeedRatio { get; set; } = null;
        }

        static bool checkCompressVideoFootageStopFlag = false;
        static List<CompressVideoFootageGlobalVariable> compressVideoFootageGlobalVariables = new List<CompressVideoFootageGlobalVariable>();
        static List<AnalyzeVideoFootageGlobalVariable> analyzeVideoFootageGlobalVariables = new List<AnalyzeVideoFootageGlobalVariable>();

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;

            HttpClientHandler handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            _client = new HttpClient(handler);
            // _client.BaseAddress = new Uri("https://localhost:5001/");
            _client.BaseAddress = new Uri("http://localhost:5000/");

            HttpClientHandler handlerMediaMTX = new HttpClientHandler();
            _clientMediaMTX = new HttpClient(handlerMediaMTX);
            _clientMediaMTX.BaseAddress = new Uri("http://localhost:9997/");

            HttpClientHandler handlerFaceMe = new HttpClientHandler();
            _clientFaceMe = new HttpClient(handlerFaceMe);
            _clientFaceMe.BaseAddress = new Uri("http://localhost:8080/");
        }

        static async void CompressVideoFootage(object idObj)
        {
            int i = (int)idObj;

            Log.Information($"Compress video footage channel {i} is ready");

            HttpResponseMessage _response;

            while (!compressVideoFootageGlobalVariables[i].stopFlag)
            {
                while (!compressVideoFootageGlobalVariables[i].startFlag)
                {
                    await Task.Delay(1000);
                }

                string originalVideoUrlMp4 = Path.ChangeExtension(compressVideoFootageGlobalVariables[i].originalVideoUrl, ".mp4");

                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    WorkingDirectory = MediaMTX_Root_Folder,
                    FileName = "ffmpeg.exe",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                if (Path.GetExtension(compressVideoFootageGlobalVariables[i].originalVideoUrl).ToLower() != ".mp4")
                {
                    startInfo.Arguments = $"-i ../{compressVideoFootageGlobalVariables[i].originalVideoUrl} -c copy ../{originalVideoUrlMp4}";

                    using (Process process = new Process { StartInfo = startInfo })
                    {
                        process.Start();

                        process.WaitForExit();
                    }
                }

                string outputCompressVideoFootageUrl = $"{Path.GetDirectoryName(originalVideoUrlMp4)}/{Path.GetFileNameWithoutExtension(originalVideoUrlMp4)}_compressed.mp4";

                startInfo.Arguments = $"-i ../{originalVideoUrlMp4} -vcodec libx265 -crf 30 ../{outputCompressVideoFootageUrl}";

                using (Process process = new Process { StartInfo = startInfo })
                {
                    process.Start();

                    process.WaitForExit();
                }

                bool fileReady = false;

                while (!fileReady)
                {
                    try
                    {
                        using (Stream attachment = File.OpenRead($"{Parent_Directory}{outputCompressVideoFootageUrl}"))
                        {
                            fileReady = true;

                            Log.Information($"POST api/evidence/attachment/add");
                            string attachmentName = Path.GetFileName(outputCompressVideoFootageUrl);
                            MultipartFormDataContent addEvidenceAttachmentContent = new MultipartFormDataContent
                            {
                                { new StringContent(attachmentName), "attachmentName" },
                                { new StringContent(compressVideoFootageGlobalVariables[i].videoFootageId), "documentId" },
                                { new StreamContent(attachment), "attachment", attachmentName }
                            };
                            _response = await _client.PostAsync($"api/evidence/attachment/add", addEvidenceAttachmentContent);

                            if (!_response.IsSuccessStatusCode)
                            {
                                Log.Error($"Error accessing API : {_response.StatusCode}");
                            }
                        }
                    }
                    catch (IOException)
                    {
                        Log.Information($"File ({Parent_Directory}{outputCompressVideoFootageUrl}) is still in use");
                        Thread.Sleep(1000);
                    }
                }

                if (Path.GetExtension(compressVideoFootageGlobalVariables[i].originalVideoUrl).ToLower() != ".mp4")
                {
                    File.Delete($"{Parent_Directory}{originalVideoUrlMp4}");
                }

                File.Delete($"{Parent_Directory}{outputCompressVideoFootageUrl}");

                Log.Information($"PUT api/evidence/videofootage/updateiscompressed");
                UpdateIsCompressedVideoFootageRequest updateIsCompressedVideoFootageRequest = new UpdateIsCompressedVideoFootageRequest
                {
                    videoFootageId = compressVideoFootageGlobalVariables[i].videoFootageId,
                    isCompressed = true
                };
                StringContent updateIsCompressedVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateIsCompressedVideoFootageRequest), Encoding.UTF8, "application/json");
                _response = await _client.PutAsync($"api/evidence/videofootage/updateiscompressed", updateIsCompressedVideoFootageContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information("Compress video footage finished");

                compressVideoFootageGlobalVariables[i].startFlag = false;
                compressVideoFootageGlobalVariables[i].videoFootageId = null;
                compressVideoFootageGlobalVariables[i].originalVideoUrl = null;
            }

            Log.Information($"Compress video footage channel {i} is stopped");
        }

        static async void CheckCompressVideoFootage()
        {
            Log.Information($"Check compress video footage is ready");

            HttpResponseMessage _response;

            // Setup Channel 1
            compressVideoFootageGlobalVariables.Add(new CompressVideoFootageGlobalVariable());
            Thread compressVideoFootageCh1 = new Thread(new ParameterizedThreadStart(CompressVideoFootage));
            compressVideoFootageCh1.Start(0);

            // Setup Channel 2
            compressVideoFootageGlobalVariables.Add(new CompressVideoFootageGlobalVariable());
            Thread compressVideoFootageCh2 = new Thread(new ParameterizedThreadStart(CompressVideoFootage));
            compressVideoFootageCh2.Start(1);

            SubscriptionWorker<VideoFootage> videoFootageToCompress_SubscriptionWorker = DocumentStoreHolder.Store.Subscriptions.GetSubscriptionWorker<VideoFootage>(videoFootageToCompress_SubscriptionName);

            await videoFootageToCompress_SubscriptionWorker.Run(async batch =>
            {
                using (IAsyncDocumentSession session = batch.OpenAsyncSession())
                {
                    foreach (VideoFootage videoFootage in batch.Items.Select(x => x.Result))
                    {
                        while (true)
                        {
                            bool videoFootageIsCompressed = false;

                            for (int i = 0; i < compressVideoFootageGlobalVariables.Count; i++)
                            {
                                if (!compressVideoFootageGlobalVariables[i].startFlag)
                                {
                                    compressVideoFootageGlobalVariables[i].videoFootageId = videoFootage.VideoFootageId;
                                    compressVideoFootageGlobalVariables[i].originalVideoUrl = videoFootage.OriginalVideoUrl.Replace("../", "");

                                    compressVideoFootageGlobalVariables[i].startFlag = true;
                                    Log.Information("Compress video footage started");

                                    Log.Information($"PUT api/evidence/videofootage/updateiscompressed");
                                    UpdateIsCompressedVideoFootageRequest updateIsCompressedVideoFootageRequest = new UpdateIsCompressedVideoFootageRequest
                                    {
                                        videoFootageId = compressVideoFootageGlobalVariables[i].videoFootageId,
                                        isCompressed = null
                                    };
                                    StringContent updateIsCompressedVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateIsCompressedVideoFootageRequest), Encoding.UTF8, "application/json");
                                    _response = await _client.PutAsync($"api/evidence/videofootage/updateiscompressed", updateIsCompressedVideoFootageContent);

                                    if (!_response.IsSuccessStatusCode)
                                    {
                                        Log.Error($"Error accessing API : {_response.StatusCode}");
                                    }

                                    videoFootageIsCompressed = true;

                                    break;
                                }
                            }

                            if (videoFootageIsCompressed)
                            {
                                break;
                            }

                            await Task.Delay(1000);
                        }
                    }
                }
            });

            while (!checkCompressVideoFootageStopFlag)
            {
                await Task.Delay(1000);
            }

            foreach (CompressVideoFootageGlobalVariable compressVideoFootageGlobalVariable in compressVideoFootageGlobalVariables)
            {
                compressVideoFootageGlobalVariable.stopFlag = true;
            }

            compressVideoFootageCh1.Join();
            compressVideoFootageCh2.Join();

            Log.Information($"Check compress video footage is stopped");
        }

        static async void AnalyzeVideoFootage(object idObj)
        {
            int i = (int)idObj;

            Log.Information($"Analyze video footage channel {i} is ready");

            HttpResponseMessage _response;

            while (!analyzeVideoFootageGlobalVariables[i].stopFlag)
            {
                long? cameraId = null;

                while (!analyzeVideoFootageGlobalVariables[i].startFlag)
                {
                    await Task.Delay(1000);
                }

                Log.Information($"POST api/website/workstation/camera/all");
                _response = await _clientFaceMe.PostAsync($"api/website/workstation/camera/all", null);

                if (_response.IsSuccessStatusCode)
                {
                    List<FaceMeListWorkstationsAndCamerasResponse>? faceMeListWorkstationsAndCamerasResponses = JsonConvert.DeserializeObject<List<FaceMeListWorkstationsAndCamerasResponse>>(await _response.Content.ReadAsStringAsync());

                    if (faceMeListWorkstationsAndCamerasResponses != null)
                    {
                        foreach (FaceMeListWorkstationsAndCamerasResponse faceMeListWorkstationsAndCamerasResponse in faceMeListWorkstationsAndCamerasResponses)
                        {
                            foreach (FaceMeListWorkstationsAndCamerasCameraResponse faceMeListWorkstationsAndCamerasCameraResponse in faceMeListWorkstationsAndCamerasResponse.cameras)
                            {
                                if (faceMeListWorkstationsAndCamerasCameraResponse.name == analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath)
                                {
                                    cameraId = faceMeListWorkstationsAndCamerasCameraResponse.cameraId;

                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                bool mediaMTXPathExist = false;

                Log.Information($"GET v3/config/paths/list");
                _response = await _clientMediaMTX.GetAsync($"v3/config/paths/list");

                if (_response.IsSuccessStatusCode)
                {
                    MediaMTXConfigPathsListResponse? mediaMTXConfigPathsListResponse = JsonConvert.DeserializeObject<MediaMTXConfigPathsListResponse>(await _response.Content.ReadAsStringAsync());

                    if (mediaMTXConfigPathsListResponse != null)
                    {
                        foreach (MediaMTXConfigPathsListItemResponse mediaMTXConfigPathsListItemResponse in mediaMTXConfigPathsListResponse.items)
                        {
                            if (mediaMTXConfigPathsListItemResponse.name == analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath)
                            {
                                mediaMTXPathExist = true;
                            }
                        }
                    }
                }
                else
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                if (mediaMTXPathExist)
                {
                    Log.Information($"PATCH v3/config/paths/patch/{analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath}");
                    MediaMTXConfigPathsPatchRequest mediaMTXConfigPathsPatchRequest = new MediaMTXConfigPathsPatchRequest
                    {
                        runOnInit = $"ffmpeg -itsscale {1 / analyzeVideoFootageGlobalVariables[i].analysisSpeedRatio} -re -stream_loop 0 -i ../{analyzeVideoFootageGlobalVariables[i].originalVideoUrl} -c copy -f rtsp rtsp://localhost:$RTSP_PORT/$MTX_PATH"
                    };
                    StringContent mediaMTXConfigPathsPatchContent = new StringContent(JsonConvert.SerializeObject(mediaMTXConfigPathsPatchRequest), Encoding.UTF8, "application/json");
                    _response = await _clientMediaMTX.PatchAsync($"v3/config/paths/patch/{analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath}", mediaMTXConfigPathsPatchContent);

                    if (!_response.IsSuccessStatusCode)
                    {
                        Log.Error($"Error accessing API : {_response.StatusCode}");
                    }
                }
                else
                {
                    Log.Information($"POST v3/config/paths/add/{analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath}");
                    MediaMTXConfigPathsAddRequest mediaMTXConfigPathsAddRequest = new MediaMTXConfigPathsAddRequest
                    {
                        runOnInit = $"ffmpeg -itsscale {1 / analyzeVideoFootageGlobalVariables[i].analysisSpeedRatio} -re -stream_loop 0 -i ../{analyzeVideoFootageGlobalVariables[i].originalVideoUrl} -c copy -f rtsp rtsp://localhost:$RTSP_PORT/$MTX_PATH"
                    };
                    StringContent mediaMTXConfigPathsAddContent = new StringContent(JsonConvert.SerializeObject(mediaMTXConfigPathsAddRequest), Encoding.UTF8, "application/json");
                    _response = await _clientMediaMTX.PostAsync($"v3/config/paths/add/{analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath}", mediaMTXConfigPathsAddContent);

                    if (!_response.IsSuccessStatusCode)
                    {
                        Log.Error($"Error accessing API : {_response.StatusCode}");
                    }
                }

                DateTime videoFootageStartedAt = DateTime.UtcNow;

                Log.Information($"POST api/website/camera/active");
                FormUrlEncodedContent faceMeActivateCameraContent = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "cameraId", cameraId.ToString() },
                    { "active", "true" }
                });
                _response = await _clientFaceMe.PostAsync($"api/website/camera/active", faceMeActivateCameraContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information($"PUT api/evidence/videofootage/updatestartedat");
                UpdateStartedAtVideoFootageRequest updateStartedAtVideoFootageRequest = new UpdateStartedAtVideoFootageRequest
                {
                    videoFootageId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                    startedAt = videoFootageStartedAt
                };
                StringContent updateStartedAtVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateStartedAtVideoFootageRequest), Encoding.UTF8, "application/json");
                _response = await _client.PutAsync($"api/evidence/videofootage/updatestartedat", updateStartedAtVideoFootageContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                bool videoFootageIsStarted = false;

                while (!analyzeVideoFootageGlobalVariables[i].finishFlag)
                {
                    bool videoFootageIsFinished = true;

                    Log.Information($"GET v3/rtspsessions/list");
                    _response = await _clientMediaMTX.GetAsync($"v3/rtspsessions/list");

                    if (_response.IsSuccessStatusCode)
                    {
                        MediaMTXRTSPSessionsListResponse? mediaMTXRTSPSessionsListResponse = JsonConvert.DeserializeObject<MediaMTXRTSPSessionsListResponse>(await _response.Content.ReadAsStringAsync());

                        if (mediaMTXRTSPSessionsListResponse != null)
                        {
                            foreach (MediaMTXRTSPSessionsListItemResponse mediaMTXRTSPSessionsListItemResponse in mediaMTXRTSPSessionsListResponse.items)
                            {
                                if (mediaMTXRTSPSessionsListItemResponse.state == "publish" && mediaMTXRTSPSessionsListItemResponse.path == analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath)
                                {
                                    videoFootageIsStarted = true;
                                    videoFootageIsFinished = false;

                                    break;
                                }
                            }

                            if (videoFootageIsStarted && videoFootageIsFinished)
                            {
                                analyzeVideoFootageGlobalVariables[i].finishFlag = true;

                                break;
                            }
                        }
                    }
                    else
                    {
                        Log.Error($"Error accessing API : {_response.StatusCode}");
                    }

                    await Task.Delay(1000);
                }

                DateTime videoFootageEndedAt = DateTime.UtcNow;

                Log.Information($"POST api/website/camera/active");
                faceMeActivateCameraContent = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "cameraId", cameraId.ToString() },
                    { "active", "false" }
                });
                _response = await _clientFaceMe.PostAsync($"api/website/camera/active", faceMeActivateCameraContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                // DELAY

                Log.Information($"POST api/website/record/history");
                FaceMeQueryHistoryRecordFilterRequest faceMeQueryHistoryRecordFilterRequest = new FaceMeQueryHistoryRecordFilterRequest
                {
                    cameraId = new List<long>
                    {
                        (long)cameraId
                    }
                };
                FormUrlEncodedContent faceMeQueryHistoryRecordContent = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "startDate", videoFootageStartedAt.ToString("o") },
                    { "endDate", videoFootageEndedAt.ToString("o") },
                    { "filter", JsonConvert.SerializeObject(faceMeQueryHistoryRecordFilterRequest) },
                    { "pageIndex", "" },
                    { "pageSize", "" },
                    { "orderBy", "time:asc" }
                });
                _response = await _clientFaceMe.PostAsync($"api/website/record/history", faceMeQueryHistoryRecordContent);

                if (_response.IsSuccessStatusCode)
                {
                    FaceMeQueryHistoryRecordResponse? faceMeQueryHistoryRecordResponse = JsonConvert.DeserializeObject<FaceMeQueryHistoryRecordResponse>(await _response.Content.ReadAsStringAsync());

                    if (faceMeQueryHistoryRecordResponse != null)
                    {
                        foreach (FaceMeQueryHistoryRecordResultResponse faceMeQueryHistoryRecordResultResponse in faceMeQueryHistoryRecordResponse.results)
                        {
                            // Skip stranger
                            if (faceMeQueryHistoryRecordResultResponse.visitor.name == null)
                            {
                                continue;
                            }

                            DateTime faceRecognitionDataTimestamp = DateTime.UtcNow;

                            Log.Information($"POST api/facerecognitiondata/timeseries/add");
                            AddFaceRecognitionDataTimeSeriesRequest addFaceRecognitionDataTimeSeriesRequest = new AddFaceRecognitionDataTimeSeriesRequest
                            {
                                faceRecognitionDataTimestamp = faceRecognitionDataTimestamp,
                                documentId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                                unixTimestamp = (long)(DateTime.ParseExact(faceMeQueryHistoryRecordResultResponse.logTime, "yyyy-MM-ddTHH:mm:ss.fffZ", null, DateTimeStyles.RoundtripKind).Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds,
                                personNumber = (int)faceMeQueryHistoryRecordResultResponse.visitor.personId,
                                mask = faceMeQueryHistoryRecordResultResponse.mask
                            };
                            StringContent addFaceRecognitionDataTimeSeriesContent = new StringContent(JsonConvert.SerializeObject(addFaceRecognitionDataTimeSeriesRequest), Encoding.UTF8, "application/json");
                            _response = await _client.PostAsync($"api/facerecognitiondata/timeseries/add", addFaceRecognitionDataTimeSeriesContent);

                            if (!_response.IsSuccessStatusCode)
                            {
                                Log.Error($"Error accessing API : {_response.StatusCode}");
                            }

                            Log.Information($"GET {faceMeQueryHistoryRecordResultResponse.snapshotUrl.Substring(1)}");
                            _response = await _clientFaceMe.GetAsync($"{faceMeQueryHistoryRecordResultResponse.snapshotUrl.Substring(1)}");

                            if (_response.IsSuccessStatusCode)
                            {
                                using (Stream attachment = await _response.Content.ReadAsStreamAsync())
                                {
                                    Log.Information($"POST api/evidence/attachment/add");
                                    string attachmentName = $"FaceRecognitionDataTimeSeries_{(long)(faceRecognitionDataTimestamp.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}.jpg";
                                    MultipartFormDataContent addEvidenceAttachmentContent = new MultipartFormDataContent
                                    {
                                        { new StringContent(attachmentName), "attachmentName" },
                                        { new StringContent(analyzeVideoFootageGlobalVariables[i].videoFootageId), "documentId" },
                                        { new StreamContent(attachment), "attachment", attachmentName }
                                    };
                                    _response = await _client.PostAsync($"api/evidence/attachment/add", addEvidenceAttachmentContent);

                                    if (!_response.IsSuccessStatusCode)
                                    {
                                        Log.Error($"Error accessing API : {_response.StatusCode}");
                                    }
                                }
                            }
                            else
                            {
                                Log.Error($"Error accessing API : {_response.StatusCode}");
                            }
                        }
                    }
                }
                else
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information($"GET api/facemesecurity/peopleattributedata?startDate={(long)(videoFootageStartedAt.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}&endDate={(long)(videoFootageEndedAt.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}&cameraId={cameraId}");
                _response = await _client.GetAsync($"api/facemesecurity/peopleattributedata?startDate={(long)(videoFootageStartedAt.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}&endDate={(long)(videoFootageEndedAt.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}&cameraId={cameraId}");

                if (_response.IsSuccessStatusCode)
                {
                    List<FaceMeSecurityGetPeopleAttributeDataResponse> faceMeSecurityGetPeopleAttributeDataResponses = JsonConvert.DeserializeObject<List<FaceMeSecurityGetPeopleAttributeDataResponse>>(await _response.Content.ReadAsStringAsync());

                    foreach (FaceMeSecurityGetPeopleAttributeDataResponse faceMeSecurityGetPeopleAttributeDataResponse in faceMeSecurityGetPeopleAttributeDataResponses)
                    {
                        if (faceMeSecurityGetPeopleAttributeDataResponse.snapshotUrl != null)
                        {
                            Log.Information($"GET {faceMeSecurityGetPeopleAttributeDataResponse.snapshotUrl.Substring(1)}");
                            _response = await _clientFaceMe.GetAsync($"{faceMeSecurityGetPeopleAttributeDataResponse.snapshotUrl.Substring(1)}");

                            if (_response.IsSuccessStatusCode)
                            {
                                DateTime peopleAttributeDataTimestamp = DateTime.UtcNow;

                                using (Stream attachment = await _response.Content.ReadAsStreamAsync())
                                {
                                    Log.Information($"POST api/evidence/attachment/add");
                                    string attachmentName = $"PeopleAttributeDataTimeSeries_{(long)(peopleAttributeDataTimestamp.Subtract(new DateTime(1970, 1, 1))).TotalMilliseconds}.jpg";
                                    MultipartFormDataContent addEvidenceAttachmentContent = new MultipartFormDataContent
                                    {
                                        { new StringContent(attachmentName), "attachmentName" },
                                        { new StringContent(analyzeVideoFootageGlobalVariables[i].videoFootageId), "documentId" },
                                        { new StreamContent(attachment), "attachment", attachmentName }
                                    };
                                    _response = await _client.PostAsync($"api/evidence/attachment/add", addEvidenceAttachmentContent);

                                    if (!_response.IsSuccessStatusCode)
                                    {
                                        Log.Error($"Error accessing API : {_response.StatusCode}");
                                    }
                                }

                                Log.Information($"POST api/peopleattributedata/timeseries/add");
                                AddPeopleAttributeDataTimeSeriesRequest addPeopleAttributeDataTimeSeriesRequest = new AddPeopleAttributeDataTimeSeriesRequest
                                {
                                    peopleAttributeDataTimestamp = peopleAttributeDataTimestamp,
                                    documentId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                                    unixTimestampStart = faceMeSecurityGetPeopleAttributeDataResponse.unixTimestampStart,
                                    unixTimestampEnd = faceMeSecurityGetPeopleAttributeDataResponse.unixTimestampEnd,
                                    personNumber = faceMeSecurityGetPeopleAttributeDataResponse.personNumber,
                                    young = faceMeSecurityGetPeopleAttributeDataResponse.young,
                                    adult = faceMeSecurityGetPeopleAttributeDataResponse.adult,
                                    male = faceMeSecurityGetPeopleAttributeDataResponse.male,
                                    female = faceMeSecurityGetPeopleAttributeDataResponse.female,
                                    hairShort = faceMeSecurityGetPeopleAttributeDataResponse.hairShort,
                                    hairLong = faceMeSecurityGetPeopleAttributeDataResponse.hairLong,
                                    upperLengthLong = faceMeSecurityGetPeopleAttributeDataResponse.upperLengthLong,
                                    upperLengthShort = faceMeSecurityGetPeopleAttributeDataResponse.upperLengthShort,
                                    lowerLengthLong = faceMeSecurityGetPeopleAttributeDataResponse.lowerLengthLong,
                                    lowerLengthShort = faceMeSecurityGetPeopleAttributeDataResponse.lowerLengthShort,
                                    pants = faceMeSecurityGetPeopleAttributeDataResponse.pants,
                                    skirt = faceMeSecurityGetPeopleAttributeDataResponse.skirt,
                                    bag = faceMeSecurityGetPeopleAttributeDataResponse.bag,
                                    hat = faceMeSecurityGetPeopleAttributeDataResponse.hat,
                                    helmet = faceMeSecurityGetPeopleAttributeDataResponse.helmet,
                                    backBag = faceMeSecurityGetPeopleAttributeDataResponse.backBag,
                                    upperColorBlack = faceMeSecurityGetPeopleAttributeDataResponse.upperColorBlack,
                                    upperColorWhite = faceMeSecurityGetPeopleAttributeDataResponse.upperColorWhite,
                                    upperColorRed = faceMeSecurityGetPeopleAttributeDataResponse.upperColorRed,
                                    upperColorGreen = faceMeSecurityGetPeopleAttributeDataResponse.upperColorGreen,
                                    upperColorYellow = faceMeSecurityGetPeopleAttributeDataResponse.upperColorYellow,
                                    upperColorOrange = faceMeSecurityGetPeopleAttributeDataResponse.upperColorOrange,
                                    upperColorPurple = faceMeSecurityGetPeopleAttributeDataResponse.upperColorPurple,
                                    upperColorPink = faceMeSecurityGetPeopleAttributeDataResponse.upperColorPink,
                                    upperColorBlue = faceMeSecurityGetPeopleAttributeDataResponse.upperColorBlue,
                                    upperColorGray = faceMeSecurityGetPeopleAttributeDataResponse.upperColorGray,
                                    lowerColorBlack = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorBlack,
                                    lowerColorWhite = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorWhite,
                                    lowerColorRed = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorRed,
                                    lowerColorGreen = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorGreen,
                                    lowerColorYellow = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorYellow,
                                    lowerColorOrange = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorOrange,
                                    lowerColorPurple = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorPurple,
                                    lowerColorPink = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorPink,
                                    lowerColorBlue = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorBlue,
                                    lowerColorGray = faceMeSecurityGetPeopleAttributeDataResponse.lowerColorGray
                                };
                                StringContent addPeopleAttributeDataTimeSeriesContent = new StringContent(JsonConvert.SerializeObject(addPeopleAttributeDataTimeSeriesRequest), Encoding.UTF8, "application/json");
                                _response = await _client.PostAsync($"api/peopleattributedata/timeseries/add", addPeopleAttributeDataTimeSeriesContent);

                                if (!_response.IsSuccessStatusCode)
                                {
                                    Log.Error($"Error accessing API : {_response.StatusCode}");
                                }
                            }
                            else
                            {
                                Log.Error($"Error accessing API : {_response.StatusCode}");
                            }
                        }
                    }
                }
                else
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information($"PUT api/evidence/videofootage/updateendedat");
                UpdateEndedAtVideoFootageRequest updateEndedAtVideoFootageRequest = new UpdateEndedAtVideoFootageRequest
                {
                    videoFootageId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                    endedAt = videoFootageEndedAt
                };
                StringContent updateEndedAtVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateEndedAtVideoFootageRequest), Encoding.UTF8, "application/json");
                _response = await _client.PutAsync($"api/evidence/videofootage/updateendedat", updateEndedAtVideoFootageContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information($"PUT api/evidence/videofootage/updatestatus");
                UpdateStatusVideoFootageRequest updateStatusVideoFootageRequest = new UpdateStatusVideoFootageRequest
                {
                    videoFootageId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                    status = "COMPLETED"
                };
                StringContent updateStatusVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateStatusVideoFootageRequest), Encoding.UTF8, "application/json");
                _response = await _client.PutAsync($"api/evidence/videofootage/updatestatus", updateStatusVideoFootageContent);

                if (!_response.IsSuccessStatusCode)
                {
                    Log.Error($"Error accessing API : {_response.StatusCode}");
                }

                Log.Information("Analyze video footage finished");

                analyzeVideoFootageGlobalVariables[i].startFlag = false;
                analyzeVideoFootageGlobalVariables[i].finishFlag = false;
                analyzeVideoFootageGlobalVariables[i].videoFootageId = null;
                analyzeVideoFootageGlobalVariables[i].originalVideoUrl = null;
                analyzeVideoFootageGlobalVariables[i].analysisSpeedRatio = null;
            }

            Log.Information($"Analyze video footage channel {i} is stopped");
        }

        async void AddEvidence(string evidenceFullPath)
        {
            HttpResponseMessage _response;

            if (videoFootageFileSupportFormats.Contains(Path.GetExtension(evidenceFullPath)))
            {
                bool fileReady = false;

                while (!fileReady)
                {
                    try
                    {
                        string evidenceJsonFullPath = Path.ChangeExtension(evidenceFullPath, ".json");

                        using (Stream file = File.OpenRead(evidenceFullPath))
                        {
                            fileReady = true;

                            _logger.LogInformation($"POST api/evidence/videofootage/add");
                            MultipartFormDataContent addVideoFootageContent = new MultipartFormDataContent
                            {
                                { new StringContent(systemAdmin.UserId), "creatorUserId" },
                                { new StreamContent(file), "file", Path.GetFileName(evidenceFullPath) }
                            };
                            
                            if (File.Exists(evidenceJsonFullPath))
                            {
                                NxDeviceRecordingData? nxDeviceRecordingData = JsonConvert.DeserializeObject<NxDeviceRecordingData>(File.ReadAllText(evidenceJsonFullPath));

                                if (nxDeviceRecordingData != null)
                                {
                                    addVideoFootageContent.Add(new StringContent(nxDeviceRecordingData.startedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")), "recordingStartedAt");
                                }
                            }

                            _response = await _client.PostAsync($"api/evidence/videofootage/add", addVideoFootageContent);
                        }

                        if (_response.IsSuccessStatusCode)
                        {
                            File.Delete(evidenceFullPath);
                            File.Delete(evidenceJsonFullPath);
                        }
                        else
                        {
                            _logger.LogError($"Error accessing API : {_response.StatusCode}");
                        }
                    }
                    catch (IOException)
                    {
                        _logger.LogInformation($"File ({evidenceFullPath}) is still in use");
                        Thread.Sleep(1000);
                    }
                }
            }
        }

        void EvidenceFolder_OnCreated(object source, FileSystemEventArgs e)
        {
            if (e.ChangeType == WatcherChangeTypes.Created)
            {
                _logger.LogInformation($"New evidence detected : {e.FullPath}");
                AddEvidence(e.FullPath);
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _logger.LogInformation("Initialization");
                HttpResponseMessage _response;

                if (!Directory.Exists(Evidence_Root_Folder))
                {
                    Directory.CreateDirectory(Evidence_Root_Folder);
                }

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

                FileInfo[] evidenceFiles = new DirectoryInfo(Evidence_Root_Folder).GetFiles();

                foreach (FileInfo evidenceFile in evidenceFiles.OrderBy(ef => ef.CreationTime))
                {
                    _logger.LogInformation($"Evidence detected : {evidenceFile.FullName}");
                    AddEvidence(evidenceFile.FullName);
                }

                using (FileSystemWatcher evidenceFolderWatcher = new FileSystemWatcher(Evidence_Root_Folder))
                {
                    evidenceFolderWatcher.Created += EvidenceFolder_OnCreated;
                    evidenceFolderWatcher.EnableRaisingEvents = true;

                    _logger.LogInformation("Stop mediamtx.exe");
                    foreach (Process mediamtx in Process.GetProcessesByName("mediamtx"))
                    {
                        mediamtx.Kill();
                    }

                    _logger.LogInformation("Stop ffmpeg.exe");
                    foreach (Process ffmpeg in Process.GetProcessesByName("ffmpeg"))
                    {
                        ffmpeg.Kill();
                    }

                    _logger.LogInformation("Start mediamtx.exe");
                    var process = new Process();
                    var startInfo = new ProcessStartInfo
                    {
                        WorkingDirectory = MediaMTX_Root_Folder,
                        WindowStyle = ProcessWindowStyle.Normal,
                        FileName = "cmd.exe",
                        RedirectStandardInput = true,
                        UseShellExecute = false
                    };
                    process.StartInfo = startInfo;
                    process.Start();
                    process.StandardInput.WriteLine("mediamtx.exe");

                    Thread checkCompressVideoFootage = new Thread(new ThreadStart(CheckCompressVideoFootage));
                    checkCompressVideoFootage.Start();

                    // Setup Channel 1
                    analyzeVideoFootageGlobalVariables.Add(new AnalyzeVideoFootageGlobalVariable
                    {
                        mediaMTXCHPath = MediaMTX_CH1_Path
                    });
                    Thread analyzeVideoFootageCh1 = new Thread(new ParameterizedThreadStart(AnalyzeVideoFootage));
                    analyzeVideoFootageCh1.Start(analyzeVideoFootageGlobalVariables.FindIndex(a => a.mediaMTXCHPath == MediaMTX_CH1_Path));

                    // Setup Channel 2
                    analyzeVideoFootageGlobalVariables.Add(new AnalyzeVideoFootageGlobalVariable
                    {
                        mediaMTXCHPath = MediaMTX_CH2_Path
                    });
                    Thread analyzeVideoFootageCh2 = new Thread(new ParameterizedThreadStart(AnalyzeVideoFootage));
                    analyzeVideoFootageCh2.Start(analyzeVideoFootageGlobalVariables.FindIndex(a => a.mediaMTXCHPath == MediaMTX_CH2_Path));

                    // Setup Channel 3
                    analyzeVideoFootageGlobalVariables.Add(new AnalyzeVideoFootageGlobalVariable
                    {
                        mediaMTXCHPath = MediaMTX_CH3_Path
                    });
                    Thread analyzeVideoFootageCh3 = new Thread(new ParameterizedThreadStart(AnalyzeVideoFootage));
                    analyzeVideoFootageCh3.Start(analyzeVideoFootageGlobalVariables.FindIndex(a => a.mediaMTXCHPath == MediaMTX_CH3_Path));

                    // Setup Channel 4
                    analyzeVideoFootageGlobalVariables.Add(new AnalyzeVideoFootageGlobalVariable
                    {
                        mediaMTXCHPath = MediaMTX_CH4_Path
                    });
                    Thread analyzeVideoFootageCh4 = new Thread(new ParameterizedThreadStart(AnalyzeVideoFootage));
                    analyzeVideoFootageCh4.Start(analyzeVideoFootageGlobalVariables.FindIndex(a => a.mediaMTXCHPath == MediaMTX_CH4_Path));

                    SubscriptionWorker<VideoFootage> videoFootageToAnalyze_SubscriptionWorker = DocumentStoreHolder.Store.Subscriptions.GetSubscriptionWorker<VideoFootage>(videoFootageToAnalyze_SubscriptionName);

                    await videoFootageToAnalyze_SubscriptionWorker.Run(async batch =>
                    {
                        using (IAsyncDocumentSession session = batch.OpenAsyncSession())
                        {
                            foreach (VideoFootage videoFootage in batch.Items.Select(x => x.Result))
                            {
                                string? faceMeToken = null;

                                while (true)
                                {
                                    bool videoFootageIsAnalyzed = false;

                                    for (int i = 0; i < analyzeVideoFootageGlobalVariables.Count; i++)
                                    {
                                        if (!analyzeVideoFootageGlobalVariables[i].startFlag && !analyzeVideoFootageGlobalVariables[i].finishFlag)
                                        {
                                            analyzeVideoFootageGlobalVariables[i].videoFootageId = videoFootage.VideoFootageId;
                                            analyzeVideoFootageGlobalVariables[i].originalVideoUrl = videoFootage.OriginalVideoUrl.Replace("../", "");
                                            analyzeVideoFootageGlobalVariables[i].analysisSpeedRatio = videoFootage.AnalysisSpeedRatio;

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
                                                Log.Error($"Error accessing API : {_response.StatusCode}");
                                            }

                                            if (_clientFaceMe.DefaultRequestHeaders.Contains("Authorization"))
                                            {
                                                _clientFaceMe.DefaultRequestHeaders.Remove("Authorization");
                                            }
                                            _clientFaceMe.DefaultRequestHeaders.Add("Authorization", faceMeToken);

                                            analyzeVideoFootageGlobalVariables[i].startFlag = true;
                                            _logger.LogInformation("Analyze video footage started");

                                            _logger.LogInformation($"PUT api/evidence/videofootage/updatechannel");
                                            UpdateChannelVideoFootageRequest updateChannelVideoFootageRequest = new UpdateChannelVideoFootageRequest
                                            {
                                                videoFootageId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                                                channel = analyzeVideoFootageGlobalVariables[i].mediaMTXCHPath
                                            };
                                            StringContent updateChannelVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateChannelVideoFootageRequest), Encoding.UTF8, "application/json");
                                            _response = await _client.PutAsync($"api/evidence/videofootage/updatechannel", updateChannelVideoFootageContent);

                                            if (!_response.IsSuccessStatusCode)
                                            {
                                                _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                            }

                                            _logger.LogInformation($"PUT api/evidence/videofootage/updatestatus");
                                            UpdateStatusVideoFootageRequest updateStatusVideoFootageRequest = new UpdateStatusVideoFootageRequest
                                            {
                                                videoFootageId = analyzeVideoFootageGlobalVariables[i].videoFootageId,
                                                status = "ANALYZING"
                                            };
                                            StringContent updateStatusVideoFootageContent = new StringContent(JsonConvert.SerializeObject(updateStatusVideoFootageRequest), Encoding.UTF8, "application/json");
                                            _response = await _client.PutAsync($"api/evidence/videofootage/updatestatus", updateStatusVideoFootageContent);

                                            if (!_response.IsSuccessStatusCode)
                                            {
                                                _logger.LogError($"Error accessing API : {_response.StatusCode}");
                                            }

                                            videoFootageIsAnalyzed = true;

                                            break;
                                        }
                                    }

                                    if (videoFootageIsAnalyzed)
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

                    checkCompressVideoFootageStopFlag = true;

                    foreach (AnalyzeVideoFootageGlobalVariable analyzeVideoFootageGlobalVariable in analyzeVideoFootageGlobalVariables)
                    {
                        analyzeVideoFootageGlobalVariable.stopFlag = true;
                    }

                    checkCompressVideoFootage.Join();

                    analyzeVideoFootageCh1.Join();
                    analyzeVideoFootageCh2.Join();
                    analyzeVideoFootageCh3.Join();
                    analyzeVideoFootageCh4.Join();

                    _logger.LogInformation("Stop mediamtx.exe");
                    foreach (Process mediamtx in Process.GetProcessesByName("mediamtx"))
                    {
                        mediamtx.Kill();
                    }

                    _logger.LogInformation("Stop ffmpeg.exe");
                    foreach (Process ffmpeg in Process.GetProcessesByName("ffmpeg"))
                    {
                        ffmpeg.Kill();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong: {ex}");
            }
        }
    }
}