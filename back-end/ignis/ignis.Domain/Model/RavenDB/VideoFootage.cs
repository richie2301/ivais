using Raven.Client.Documents.Session.TimeSeries;

namespace ignis.Domain.Model.RavenDB
{
    public class VideoFootage
    {
        public string VideoFootageId { get; set; }
        public string EvidenceId { get; set; }
        public string Name { get; set; }
        public string? Location { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime? RecordingStartedAt { get; set; }
        public long? Duration { get; set; }
        public string? OriginalVideoUrl { get; set; }
        public float AnalysisSpeedRatio { get; set; }
        public string? Channel { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public bool? IsCompressed { get; set; }
        public string Status { get; set; } // NEW, WAITING, ANALYZING, COMPLETED
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class FaceRecognitionDataTimeSeries
    {
        [TimeSeriesValue(0)] public double UnixTimestamp { get; set; }
        [TimeSeriesValue(1)] public double PersonNumber { get; set; }
        [TimeSeriesValue(2)] public double Mask { get; set; }
    }

    public class PeopleAttributeGeneralDataTimeSeries
    {
        [TimeSeriesValue(0)] public double UnixTimestampStart { get; set; }
        [TimeSeriesValue(1)] public double UnixTimestampEnd { get; set; }
        [TimeSeriesValue(2)] public double PersonNumber { get; set; }
        [TimeSeriesValue(3)] public double Young { get; set; }
        [TimeSeriesValue(4)] public double Adult { get; set; }
        [TimeSeriesValue(5)] public double Male { get; set; }
        [TimeSeriesValue(6)] public double Female { get; set; }
        [TimeSeriesValue(7)] public double HairShort { get; set; }
        [TimeSeriesValue(8)] public double HairLong { get; set; }
        [TimeSeriesValue(9)] public double UpperLengthLong { get; set; }
        [TimeSeriesValue(10)] public double UpperLengthShort { get; set; }
        [TimeSeriesValue(11)] public double LowerLengthLong { get; set; }
        [TimeSeriesValue(12)] public double LowerLengthShort { get; set; }
        [TimeSeriesValue(13)] public double Pants { get; set; }
        [TimeSeriesValue(14)] public double Skirt { get; set; }
        [TimeSeriesValue(15)] public double Bag { get; set; }
        [TimeSeriesValue(16)] public double Hat { get; set; }
        [TimeSeriesValue(17)] public double Helmet { get; set; }
        [TimeSeriesValue(18)] public double BackBag { get; set; }
    }

    public class PeopleAttributeColorDataTimeSeries
    {
        [TimeSeriesValue(0)] public double UpperColorBlack { get; set; }
        [TimeSeriesValue(1)] public double UpperColorWhite { get; set; }
        [TimeSeriesValue(2)] public double UpperColorRed { get; set; }
        [TimeSeriesValue(3)] public double UpperColorGreen { get; set; }
        [TimeSeriesValue(4)] public double UpperColorYellow { get; set; }
        [TimeSeriesValue(5)] public double UpperColorOrange { get; set; }
        [TimeSeriesValue(6)] public double UpperColorPurple { get; set; }
        [TimeSeriesValue(7)] public double UpperColorPink { get; set; }
        [TimeSeriesValue(8)] public double UpperColorBlue { get; set; }
        [TimeSeriesValue(9)] public double UpperColorGray { get; set; }
        [TimeSeriesValue(10)] public double LowerColorBlack { get; set; }
        [TimeSeriesValue(11)] public double LowerColorWhite { get; set; }
        [TimeSeriesValue(12)] public double LowerColorRed { get; set; }
        [TimeSeriesValue(13)] public double LowerColorGreen { get; set; }
        [TimeSeriesValue(14)] public double LowerColorYellow { get; set; }
        [TimeSeriesValue(15)] public double LowerColorOrange { get; set; }
        [TimeSeriesValue(16)] public double LowerColorPurple { get; set; }
        [TimeSeriesValue(17)] public double LowerColorPink { get; set; }
        [TimeSeriesValue(18)] public double LowerColorBlue { get; set; }
        [TimeSeriesValue(19)] public double LowerColorGray { get; set; }
    }
}