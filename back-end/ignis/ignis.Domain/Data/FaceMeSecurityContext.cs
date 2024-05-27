using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ignis.Domain.Model.SQLServerExpress;

namespace ignis.Domain.Data;

public partial class FaceMeSecurityContext : DbContext
{
    public FaceMeSecurityContext(DbContextOptions<FaceMeSecurityContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AccountToken> AccountTokens { get; set; }

    public virtual DbSet<BodyColorInfo> BodyColorInfos { get; set; }

    public virtual DbSet<BodyInfo> BodyInfos { get; set; }

    public virtual DbSet<BodyParInfo> BodyParInfos { get; set; }

    public virtual DbSet<BodyRecord> BodyRecords { get; set; }

    public virtual DbSet<BodyRecordClip> BodyRecordClips { get; set; }

    public virtual DbSet<BodyRecordFaceInfo> BodyRecordFaceInfos { get; set; }

    public virtual DbSet<BodyRecordMergeInfo> BodyRecordMergeInfos { get; set; }

    public virtual DbSet<BodyRecordSnapshot> BodyRecordSnapshots { get; set; }

    public virtual DbSet<BodyRecordTemplate> BodyRecordTemplates { get; set; }

    public virtual DbSet<BodySearchCache> BodySearchCaches { get; set; }

    public virtual DbSet<CameraGroup> CameraGroups { get; set; }

    public virtual DbSet<CameraGroupsCamera> CameraGroupsCameras { get; set; }

    public virtual DbSet<CameraInfo> CameraInfos { get; set; }

    public virtual DbSet<CameraSnapshot> CameraSnapshots { get; set; }

    public virtual DbSet<CentralInfo> CentralInfos { get; set; }

    public virtual DbSet<ClipInfo> ClipInfos { get; set; }

    public virtual DbSet<Configuration> Configurations { get; set; }

    public virtual DbSet<ConfigurationDatum> ConfigurationData { get; set; }

    public virtual DbSet<CredentialInfo> CredentialInfos { get; set; }

    public virtual DbSet<EventLog> EventLogs { get; set; }

    public virtual DbSet<FaceInfo> FaceInfos { get; set; }

    public virtual DbSet<GenetecDoor> GenetecDoors { get; set; }

    public virtual DbSet<GenetecReaderCamera> GenetecReaderCameras { get; set; }

    public virtual DbSet<GenetecRioReader> GenetecRioReaders { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<GroupTag> GroupTags { get; set; }

    public virtual DbSet<GroupsPerson> GroupsPeople { get; set; }

    public virtual DbSet<ImageSearchCache> ImageSearchCaches { get; set; }

    public virtual DbSet<IoDevice> IoDevices { get; set; }

    public virtual DbSet<IoDeviceChannel> IoDeviceChannels { get; set; }

    public virtual DbSet<IoDeviceChannelCamera> IoDeviceChannelCameras { get; set; }

    public virtual DbSet<IoDeviceChannelGroup> IoDeviceChannelGroups { get; set; }

    public virtual DbSet<ModifiedItem> ModifiedItems { get; set; }

    public virtual DbSet<NxServer> NxServers { get; set; }

    public virtual DbSet<PersonInfo> PersonInfos { get; set; }

    public virtual DbSet<PersonTag> PersonTags { get; set; }

    public virtual DbSet<Record> Records { get; set; }

    public virtual DbSet<RecordClipId> RecordClipIds { get; set; }

    public virtual DbSet<RecordSnapshot> RecordSnapshots { get; set; }

    public virtual DbSet<RecordTemplate> RecordTemplates { get; set; }

    public virtual DbSet<RecordingServer> RecordingServers { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Snapshot> Snapshots { get; set; }

    public virtual DbSet<TmpPersonTemplate> TmpPersonTemplates { get; set; }

    public virtual DbSet<UGroup> UGroups { get; set; }

    public virtual DbSet<VisitorSummary> VisitorSummaries { get; set; }

    public virtual DbSet<VmsEventRule> VmsEventRules { get; set; }

    public virtual DbSet<VmsEventRuleCamera> VmsEventRuleCameras { get; set; }

    public virtual DbSet<VmsEventRuleGroup> VmsEventRuleGroups { get; set; }

    public virtual DbSet<VmsPersonEnrollRecord> VmsPersonEnrollRecords { get; set; }

    public virtual DbSet<WorkstationCentral> WorkstationCentrals { get; set; }

    public virtual DbSet<WorkstationInfo> WorkstationInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("account");

            entity.HasIndex(e => e.Account1, "IX_account");

            entity.HasIndex(e => e.Email, "IX_account_email");

            entity.Property(e => e.AccountId).HasColumnName("account_id");
            entity.Property(e => e.Account1)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("account");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Email)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IsActivated)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_activated");
            entity.Property(e => e.IsDefault).HasColumnName("is_default");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Locale)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasDefaultValueSql("('')")
                .IsFixedLength()
                .HasColumnName("locale");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasDefaultValueSql("('')")
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Region)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasDefaultValueSql("('')")
                .IsFixedLength()
                .HasColumnName("region");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
        });

        modelBuilder.Entity<AccountToken>(entity =>
        {
            entity.HasKey(e => e.TokenId);

            entity.ToTable("account_token");

            entity.HasIndex(e => e.Token, "IX_account_token");

            entity.HasIndex(e => e.AccountId, "IX_account_token_account_id");

            entity.HasIndex(e => e.SourceType, "IX_account_token_source_type");

            entity.Property(e => e.TokenId).HasColumnName("token_id");
            entity.Property(e => e.AccountId).HasColumnName("account_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.ExpirationDate)
                .HasPrecision(3)
                .HasColumnName("expiration_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.RelatedId).HasColumnName("related_id");
            entity.Property(e => e.SourceId).HasColumnName("source_id");
            entity.Property(e => e.SourceType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("source_type");
            entity.Property(e => e.Token)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("token");
        });

        modelBuilder.Entity<BodyColorInfo>(entity =>
        {
            entity.HasKey(e => new { e.RecordId, e.ColorType });

            entity.ToTable("body_color_info");

            entity.HasIndex(e => e.Id, "UQ_body_color_info_id").IsUnique();

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.ColorType).HasColumnName("color_type");
            entity.Property(e => e.Black).HasColumnName("black");
            entity.Property(e => e.Blue).HasColumnName("blue");
            entity.Property(e => e.Gray).HasColumnName("gray");
            entity.Property(e => e.Green).HasColumnName("green");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.Orange).HasColumnName("orange");
            entity.Property(e => e.Pink).HasColumnName("pink");
            entity.Property(e => e.Purple).HasColumnName("purple");
            entity.Property(e => e.Red).HasColumnName("red");
            entity.Property(e => e.White).HasColumnName("white");
            entity.Property(e => e.Yellow).HasColumnName("yellow");
        });

        modelBuilder.Entity<BodyInfo>(entity =>
        {
            entity.HasKey(e => e.BodyId);

            entity.ToTable("body_info");

            entity.HasIndex(e => e.FaceId, "IX_body_face_id");

            entity.Property(e => e.BodyId).HasColumnName("body_id");
            entity.Property(e => e.BodyFeature).HasColumnName("body_feature");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.FaceId).HasColumnName("face_id");
            entity.Property(e => e.FeatureSize).HasColumnName("feature_size");
            entity.Property(e => e.FeatureSubType).HasColumnName("feature_sub_type");
            entity.Property(e => e.FeatureType).HasColumnName("feature_type");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Score).HasColumnName("score");
        });

        modelBuilder.Entity<BodyParInfo>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("body_par_info");

            entity.HasIndex(e => e.Id, "UQ_body_par_info_id").IsUnique();

            entity.Property(e => e.RecordId)
                .ValueGeneratedNever()
                .HasColumnName("record_id");
            entity.Property(e => e.AgeAdult).HasColumnName("age_adult");
            entity.Property(e => e.AgeYoung).HasColumnName("age_young");
            entity.Property(e => e.AttachmentBackBag).HasColumnName("attachment_back_bag");
            entity.Property(e => e.AttachmentBag).HasColumnName("attachment_bag");
            entity.Property(e => e.AttachmentHat).HasColumnName("attachment_hat");
            entity.Property(e => e.AttachmentHelmet).HasColumnName("attachment_helmet");
            entity.Property(e => e.GenderFemale).HasColumnName("gender_female");
            entity.Property(e => e.GenderMale).HasColumnName("gender_male");
            entity.Property(e => e.HairLong).HasColumnName("hair_long");
            entity.Property(e => e.HairShort).HasColumnName("hair_short");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.LowerLengthLong).HasColumnName("lower_length_long");
            entity.Property(e => e.LowerLengthShort).HasColumnName("lower_length_short");
            entity.Property(e => e.LowerTypePants).HasColumnName("lower_type_pants");
            entity.Property(e => e.LowerTypeSkirt).HasColumnName("lower_type_skirt");
            entity.Property(e => e.UpperLengthLong).HasColumnName("upper_length_long");
            entity.Property(e => e.UpperLengthShort).HasColumnName("upper_length_short");
        });

        modelBuilder.Entity<BodyRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("body_record");

            entity.HasIndex(e => e.BodyId, "IX_body_record_body_id");

            entity.HasIndex(e => new { e.BodyId, e.LogTime }, "IX_body_record_body_id_log_time");

            entity.HasIndex(e => e.CameraId, "IX_body_record_camera_id");

            entity.HasIndex(e => e.LogTime, "IX_body_record_log_time");

            entity.HasIndex(e => new { e.CameraId, e.LogTime, e.EndTime }, "IX_body_record_search");

            entity.HasIndex(e => e.WorkstationId, "IX_body_record_workstation_id");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.BodyId).HasColumnName("body_id");
            entity.Property(e => e.BoundingBoxBottom).HasColumnName("bounding_box_bottom");
            entity.Property(e => e.BoundingBoxLeft).HasColumnName("bounding_box_left");
            entity.Property(e => e.BoundingBoxRight).HasColumnName("bounding_box_right");
            entity.Property(e => e.BoundingBoxTop).HasColumnName("bounding_box_top");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.Confidence)
                .HasDefaultValueSql("((0))")
                .HasColumnName("confidence");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DebugInfo)
                .HasMaxLength(255)
                .HasColumnName("debugInfo");
            entity.Property(e => e.EndTime)
                .HasDefaultValueSql("((0))")
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.FrameTime).HasColumnName("frame_time");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.LogTime)
                .HasColumnType("datetime")
                .HasColumnName("log_time");
            entity.Property(e => e.Similarity)
                .HasDefaultValueSql("((0))")
                .HasColumnName("similarity");
            entity.Property(e => e.VmsCameraId)
                .HasMaxLength(100)
                .HasColumnName("vms_camera_id");
            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
        });

        modelBuilder.Entity<BodyRecordClip>(entity =>
        {
            entity.HasKey(e => new { e.RecordId, e.ClipId });

            entity.ToTable("body_record_clip");

            entity.HasIndex(e => e.ClipId, "IX_body_record_clip_id");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.ClipId).HasColumnName("clip_id");
        });

        modelBuilder.Entity<BodyRecordFaceInfo>(entity =>
        {
            entity.ToTable("body_record_face_info");

            entity.HasIndex(e => e.RecordId, "IX_body_record_face_info_body_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FaceFeature).HasColumnName("face_feature");
            entity.Property(e => e.FaceFeatureSize).HasColumnName("face_feature_size");
            entity.Property(e => e.FaceFeatureSubType).HasColumnName("face_feature_sub_type");
            entity.Property(e => e.FaceFeatureType).HasColumnName("face_feature_type");
            entity.Property(e => e.FaceId).HasColumnName("face_id");
            entity.Property(e => e.FaceRecordId).HasColumnName("face_record_id");
            entity.Property(e => e.RecordId).HasColumnName("record_id");
        });

        modelBuilder.Entity<BodyRecordMergeInfo>(entity =>
        {
            entity.ToTable("body_record_merge_info");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FrameId).HasColumnName("frame_id");
            entity.Property(e => e.OriginalPersonId).HasColumnName("original_person_id");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.RecordId).HasColumnName("record_id");
        });

        modelBuilder.Entity<BodyRecordSnapshot>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("body_record_snapshot");

            entity.Property(e => e.RecordId)
                .ValueGeneratedNever()
                .HasColumnName("record_id");
            entity.Property(e => e.Snapshot).HasColumnName("snapshot");
        });

        modelBuilder.Entity<BodyRecordTemplate>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("body_record_template");

            entity.Property(e => e.RecordId)
                .ValueGeneratedNever()
                .HasColumnName("record_id");
            entity.Property(e => e.BodyFeature).HasColumnName("body_feature");
            entity.Property(e => e.BodyFeatureSize).HasColumnName("body_feature_size");
            entity.Property(e => e.BodyFeatureSubType).HasColumnName("body_feature_sub_type");
            entity.Property(e => e.BodyFeatureType).HasColumnName("body_feature_type");
        });

        modelBuilder.Entity<BodySearchCache>(entity =>
        {
            entity.ToTable("body_search_cache");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedTime).HasColumnName("created_time");
            entity.Property(e => e.ExpiryTime).HasColumnName("expiry_time");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.ImageFeature).HasColumnName("image_feature");
            entity.Property(e => e.ImageType).HasColumnName("image_type");
            entity.Property(e => e.SearchId).HasColumnName("search_id");
            entity.Property(e => e.Token)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("token");
        });

        modelBuilder.Entity<CameraGroup>(entity =>
        {
            entity.ToTable("camera_group");

            entity.Property(e => e.CameraGroupId).HasColumnName("camera_group_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
        });

        modelBuilder.Entity<CameraGroupsCamera>(entity =>
        {
            entity.ToTable("camera_groups_cameras");

            entity.HasIndex(e => new { e.CameraGroupId, e.CameraId }, "IX_camera_groups_cameras");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CameraGroupId).HasColumnName("camera_group_id");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
        });

        modelBuilder.Entity<CameraInfo>(entity =>
        {
            entity.HasKey(e => e.CameraId);

            entity.ToTable("camera_info");

            entity.HasIndex(e => e.CentralId, "IX_camera_central_id");

            entity.HasIndex(e => e.IsDeleted, "IX_camera_deleted");

            entity.HasIndex(e => e.WorkstationId, "IX_camera_workstation_id");

            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.Account)
                .HasMaxLength(128)
                .HasColumnName("account");
            entity.Property(e => e.CameraType)
                .HasMaxLength(100)
                .HasDefaultValueSql("('NORMAL')")
                .HasColumnName("camera_type");
            entity.Property(e => e.CentralId).HasColumnName("central_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.ExtraInfo)
                .HasMaxLength(4000)
                .HasColumnName("extra_info");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_active");
            entity.Property(e => e.IsActiveConflict).HasColumnName("is_active_conflict");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.LastActiveTime)
                .HasColumnType("datetime")
                .HasColumnName("last_active_time");
            entity.Property(e => e.LastActiveWid).HasColumnName("last_active_wid");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Location)
                .HasMaxLength(512)
                .HasColumnName("location");
            entity.Property(e => e.Name)
                .HasMaxLength(512)
                .HasColumnName("name");
            entity.Property(e => e.Note)
                .HasMaxLength(512)
                .HasColumnName("note");
            entity.Property(e => e.Password)
                .HasMaxLength(256)
                .HasColumnName("password");
            entity.Property(e => e.RecordingServerId).HasColumnName("recording_server_id");
            entity.Property(e => e.RecordingServerName)
                .HasMaxLength(100)
                .HasColumnName("recording_server_name");
            entity.Property(e => e.RelayOnWorkstationId).HasColumnName("relay_on_workstation_id");
            entity.Property(e => e.RtspUrl)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("rtsp_url");
            entity.Property(e => e.SnapshotRequestTime)
                .HasColumnType("datetime")
                .HasColumnName("snapshot_request_time");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Version)
                .HasDefaultValueSql("((1))")
                .HasColumnName("version");
            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
        });

        modelBuilder.Entity<CameraSnapshot>(entity =>
        {
            entity.HasKey(e => e.CameraId);

            entity.ToTable("camera_snapshot");

            entity.Property(e => e.CameraId)
                .ValueGeneratedNever()
                .HasColumnName("camera_id");
            entity.Property(e => e.Snapshot).HasColumnName("snapshot");
            entity.Property(e => e.SnapshotTime)
                .HasColumnType("datetime")
                .HasColumnName("snapshot_time");
        });

        modelBuilder.Entity<CentralInfo>(entity =>
        {
            entity.HasKey(e => e.CentralId);

            entity.ToTable("central_info");

            entity.HasIndex(e => e.DeviceId, "IX_central_device_id");

            entity.HasIndex(e => e.VersionCode, "IX_central_version_code");

            entity.Property(e => e.CentralId).HasColumnName("central_id");
            entity.Property(e => e.AccessibleIp)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("accessible_ip");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DeviceId)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("device_id");
            entity.Property(e => e.ExtraInfo)
                .HasMaxLength(4000)
                .HasColumnName("extra_info");
            entity.Property(e => e.Ip)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ip");
            entity.Property(e => e.IsHide).HasColumnName("is_hide");
            entity.Property(e => e.LastAlive)
                .HasColumnType("datetime")
                .HasColumnName("last_alive");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Port).HasColumnName("port");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.VersionCode).HasColumnName("version_code");
            entity.Property(e => e.VersionName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("version_name");
        });

        modelBuilder.Entity<ClipInfo>(entity =>
        {
            entity.HasKey(e => e.ClipId);

            entity.ToTable("clip_info");

            entity.HasIndex(e => e.Category, "IX_clip_category");

            entity.HasIndex(e => new { e.StartTime, e.EndTime }, "IX_clip_date_range");

            entity.HasIndex(e => new { e.CameraId, e.StartTime, e.EndTime }, "IX_clip_info_camera_clip_period");

            entity.HasIndex(e => new { e.CentralId, e.CameraId }, "IX_clip_source_id");

            entity.HasIndex(e => new { e.StoragePath, e.ClipPath }, "UQ_clip_path").IsUnique();

            entity.Property(e => e.ClipId).HasColumnName("clip_id");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.Category).HasColumnName("category");
            entity.Property(e => e.CentralId).HasColumnName("central_id");
            entity.Property(e => e.ClipPath)
                .HasMaxLength(500)
                .HasColumnName("clip_path");
            entity.Property(e => e.ClipSize).HasColumnName("clip_size");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.StoragePath)
                .HasMaxLength(255)
                .HasColumnName("storage_path");
        });

        modelBuilder.Entity<Configuration>(entity =>
        {
            entity.HasKey(e => e.ConfigKey);

            entity.ToTable("configuration");

            entity.Property(e => e.ConfigKey)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("config_key");
            entity.Property(e => e.ConfigValue)
                .IsUnicode(false)
                .HasColumnName("config_value");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
        });

        modelBuilder.Entity<ConfigurationDatum>(entity =>
        {
            entity.HasKey(e => e.ConfigKey);

            entity.ToTable("configuration_data");

            entity.Property(e => e.ConfigKey)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("config_key");
            entity.Property(e => e.ConfigValue).HasColumnName("config_value");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
        });

        modelBuilder.Entity<CredentialInfo>(entity =>
        {
            entity.HasKey(e => e.PersonId);

            entity.ToTable("credential_info");

            entity.HasIndex(e => new { e.PersonId, e.CredentialGuid }, "IX_credential_info");

            entity.Property(e => e.PersonId)
                .ValueGeneratedNever()
                .HasColumnName("person_id");
            entity.Property(e => e.BitLength).HasColumnName("bit_length");
            entity.Property(e => e.CardType)
                .HasMaxLength(255)
                .HasColumnName("card_type");
            entity.Property(e => e.CredentialGuid)
                .HasMaxLength(255)
                .HasColumnName("credential_guid");
            entity.Property(e => e.ExpirationDate)
                .HasColumnType("datetime")
                .HasColumnName("expiration_date");
            entity.Property(e => e.RawData)
                .HasMaxLength(255)
                .HasColumnName("raw_data");
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .HasColumnName("state");
        });

        modelBuilder.Entity<EventLog>(entity =>
        {
            entity.HasKey(e => e.LogId);

            entity.ToTable("event_log");

            entity.HasIndex(e => new { e.Category, e.Source }, "IX_event_log_category_source");

            entity.HasIndex(e => e.LogLevel, "IX_event_log_level");

            entity.HasIndex(e => e.LogTime, "IX_event_log_time");

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.Data).HasColumnName("data");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.ExtraData).HasColumnName("extra_data");
            entity.Property(e => e.LogLevel).HasColumnName("log_level");
            entity.Property(e => e.LogTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("log_time");
            entity.Property(e => e.Source)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("source");
        });

        modelBuilder.Entity<FaceInfo>(entity =>
        {
            entity.HasKey(e => e.FaceId);

            entity.ToTable("face_info");

            entity.HasIndex(e => e.PersonId, "IX_face_person_id");

            entity.HasIndex(e => new { e.Feature2Type, e.Feature2SubType }, "IX_face_uh2_type");

            entity.HasIndex(e => new { e.FeatureType, e.FeatureSubType }, "IX_face_uh_type");

            entity.HasIndex(e => new { e.VhFeature2Type, e.VhFeature2SubType }, "IX_face_vh2_type");

            entity.HasIndex(e => new { e.VhFeatureType, e.VhFeatureSubType }, "IX_face_vh_type");

            entity.Property(e => e.FaceId).HasColumnName("face_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.ExtraData).HasColumnName("extra_data");
            entity.Property(e => e.FaceFeature).HasColumnName("face_feature");
            entity.Property(e => e.FaceFeature2).HasColumnName("face_feature2");
            entity.Property(e => e.Feature2Size).HasColumnName("feature2_size");
            entity.Property(e => e.Feature2SubType).HasColumnName("feature2_sub_type");
            entity.Property(e => e.Feature2Type).HasColumnName("feature2_type");
            entity.Property(e => e.FeatureSize).HasColumnName("feature_size");
            entity.Property(e => e.FeatureSubType).HasColumnName("feature_sub_type");
            entity.Property(e => e.FeatureType).HasColumnName("feature_type");
            entity.Property(e => e.IsDisabled).HasColumnName("is_disabled");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.VhFeature).HasColumnName("vh_feature");
            entity.Property(e => e.VhFeature2).HasColumnName("vh_feature2");
            entity.Property(e => e.VhFeature2Size).HasColumnName("vh_feature2_size");
            entity.Property(e => e.VhFeature2SubType).HasColumnName("vh_feature2_sub_type");
            entity.Property(e => e.VhFeature2Type).HasColumnName("vh_feature2_type");
            entity.Property(e => e.VhFeatureSize).HasColumnName("vh_feature_size");
            entity.Property(e => e.VhFeatureSubType).HasColumnName("vh_feature_sub_type");
            entity.Property(e => e.VhFeatureType).HasColumnName("vh_feature_type");
        });

        modelBuilder.Entity<GenetecDoor>(entity =>
        {
            entity.HasKey(e => e.DoorId);

            entity.ToTable("genetec_door");

            entity.HasIndex(e => e.DoorGuid, "UQ_genetec_door_guid").IsUnique();

            entity.Property(e => e.DoorId).HasColumnName("door_id");
            entity.Property(e => e.DoorGuid)
                .HasMaxLength(100)
                .HasColumnName("door_guid");
            entity.Property(e => e.DoorName)
                .HasMaxLength(100)
                .HasColumnName("door_name");
            entity.Property(e => e.DoorState).HasColumnName("door_state");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
        });

        modelBuilder.Entity<GenetecReaderCamera>(entity =>
        {
            entity.ToTable("genetec_reader_camera");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CameraGuid)
                .HasMaxLength(100)
                .HasColumnName("camera_guid");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.ReaderId).HasColumnName("reader_id");
        });

        modelBuilder.Entity<GenetecRioReader>(entity =>
        {
            entity.HasKey(e => e.ReaderId);

            entity.ToTable("genetec_rio_reader");

            entity.HasIndex(e => e.ReaderGuid, "UQ_genetec_rio_reader_guid").IsUnique();

            entity.Property(e => e.ReaderId).HasColumnName("reader_id");
            entity.Property(e => e.DoorId).HasColumnName("door_id");
            entity.Property(e => e.DoorSide).HasColumnName("door_side");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.ReaderChannel)
                .HasMaxLength(100)
                .HasColumnName("reader_channel");
            entity.Property(e => e.ReaderGuid)
                .HasMaxLength(100)
                .HasColumnName("reader_guid");
            entity.Property(e => e.ReaderIndex)
                .HasMaxLength(100)
                .HasColumnName("reader_index");
            entity.Property(e => e.ReaderInterface)
                .HasMaxLength(100)
                .HasColumnName("reader_interface");
            entity.Property(e => e.ReaderName)
                .HasMaxLength(100)
                .HasColumnName("reader_name");
            entity.Property(e => e.ReaderState).HasColumnName("reader_state");
            entity.Property(e => e.ReaderUniqueId)
                .HasMaxLength(100)
                .HasColumnName("reader_uniqueId");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.ToTable("groups");

            entity.HasIndex(e => e.IsDeleted, "IX_groups_deleted");

            entity.HasIndex(e => e.UGroupId, "IX_groups_u_group_id");

            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.Color)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("color");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.IsVisible)
                .HasDefaultValueSql("((1))")
                .HasColumnName("is_visible");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
            entity.Property(e => e.PatternId).HasColumnName("pattern_id");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("type");
            entity.Property(e => e.UGroupId).HasColumnName("u_group_id");
            entity.Property(e => e.UNotifyEnabled)
                .HasDefaultValueSql("((0))")
                .HasColumnName("u_notify_enabled");
            entity.Property(e => e.UNotifyTemplate)
                .HasMaxLength(512)
                .HasDefaultValueSql("('')")
                .HasColumnName("u_notify_template");
        });

        modelBuilder.Entity<GroupTag>(entity =>
        {
            entity.HasKey(e => e.TagId);

            entity.ToTable("group_tag");

            entity.HasIndex(e => e.GroupId, "IX_group_tag_group_id");

            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
        });

        modelBuilder.Entity<GroupsPerson>(entity =>
        {
            entity.ToTable("groups_people");

            entity.HasIndex(e => new { e.GroupId, e.PersonId }, "IX_groups_people");

            entity.HasIndex(e => e.PersonId, "IX_groups_people_person");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.IsMaskEnroll).HasColumnName("is_mask_enroll");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
        });

        modelBuilder.Entity<ImageSearchCache>(entity =>
        {
            entity.HasKey(e => e.SearchId);

            entity.ToTable("image_search_cache");

            entity.Property(e => e.SearchId).HasColumnName("search_id");
            entity.Property(e => e.CreatedTime).HasColumnName("created_time");
            entity.Property(e => e.ExpiryTime).HasColumnName("expiry_time");
            entity.Property(e => e.FaceFeature).HasColumnName("face_feature");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.Token)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("token");
            entity.Property(e => e.VhFeature).HasColumnName("vh_feature");
        });

        modelBuilder.Entity<IoDevice>(entity =>
        {
            entity.HasKey(e => e.DeviceId);

            entity.ToTable("io_device");

            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.Account)
                .HasMaxLength(255)
                .HasColumnName("account");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.CardType).HasColumnName("card_type");
            entity.Property(e => e.DataBitLength).HasColumnName("data_bit_length");
            entity.Property(e => e.ModuleId).HasColumnName("module_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.ParityBits).HasColumnName("parity_bits");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Status).HasColumnName("status");
        });

        modelBuilder.Entity<IoDeviceChannel>(entity =>
        {
            entity.HasKey(e => new { e.DeviceId, e.ChannelId });

            entity.ToTable("io_device_channel");

            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.DefaultState).HasColumnName("default_state");
            entity.Property(e => e.LastTriggerTime).HasColumnName("last_trigger_time");
            entity.Property(e => e.NativeInfo)
                .HasMaxLength(4000)
                .HasColumnName("native_info");
            entity.Property(e => e.PulseTime).HasColumnName("pulse_time");
            entity.Property(e => e.Purpose)
                .HasMaxLength(255)
                .HasColumnName("purpose");
            entity.Property(e => e.SpecificGroup)
                .HasDefaultValueSql("((1))")
                .HasColumnName("specific_group");
            entity.Property(e => e.SpecificTime)
                .HasDefaultValueSql("((1))")
                .HasColumnName("specific_time");
            entity.Property(e => e.TriggerTime)
                .HasMaxLength(100)
                .HasDefaultValueSql("('{\"weekDay\":[0,1,2,3,4,5,6],\"startHour\":0,\"endHour\":0}')")
                .HasColumnName("trigger_time");
        });

        modelBuilder.Entity<IoDeviceChannelCamera>(entity =>
        {
            entity.HasKey(e => new { e.DeviceId, e.ChannelId, e.CameraId });

            entity.ToTable("io_device_channel_camera");

            entity.HasIndex(e => e.CameraId, "IX_io_device_camera_id");

            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.Sn)
                .ValueGeneratedOnAdd()
                .HasColumnName("sn");
        });

        modelBuilder.Entity<IoDeviceChannelGroup>(entity =>
        {
            entity.HasKey(e => new { e.DeviceId, e.ChannelId, e.GroupId, e.TagId });

            entity.ToTable("io_device_channel_group");

            entity.HasIndex(e => e.GroupId, "IX_io_device_group_id");

            entity.HasIndex(e => e.TagId, "IX_io_device_tag_id");

            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.Sn)
                .ValueGeneratedOnAdd()
                .HasColumnName("sn");
        });

        modelBuilder.Entity<ModifiedItem>(entity =>
        {
            entity.ToTable("modified_item");

            entity.HasIndex(e => e.ItemId, "IX_modified_item_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.ItemId).HasColumnName("item_id");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.TableIndex).HasColumnName("table_index");
        });

        modelBuilder.Entity<NxServer>(entity =>
        {
            entity.HasKey(e => e.ServerGuid);

            entity.ToTable("nx_server");

            entity.HasIndex(e => e.ServerGuid, "UQ_nx_server_guid").IsUnique();

            entity.Property(e => e.ServerGuid)
                .HasMaxLength(100)
                .HasColumnName("server_guid");
            entity.Property(e => e.PluginPort).HasColumnName("plugin_port");
            entity.Property(e => e.ServerAddress)
                .HasMaxLength(100)
                .HasColumnName("server_address");
        });

        modelBuilder.Entity<PersonInfo>(entity =>
        {
            entity.HasKey(e => e.PersonId);

            entity.ToTable("person_info");

            entity.HasIndex(e => e.EmployeeId, "IX_person_employee");

            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.CardId)
                .HasMaxLength(100)
                .HasColumnName("card_id");
            entity.Property(e => e.Company)
                .HasMaxLength(255)
                .HasColumnName("company");
            entity.Property(e => e.CoverImage).HasColumnName("cover_image");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Email)
                .HasMaxLength(500)
                .HasColumnName("email");
            entity.Property(e => e.EmployeeId)
                .HasMaxLength(100)
                .HasColumnName("employee_id");
            entity.Property(e => e.FacilityCode)
                .HasMaxLength(100)
                .HasColumnName("facility_code");
            entity.Property(e => e.FelicaCardId)
                .HasMaxLength(100)
                .HasColumnName("felica_card_id");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
            entity.Property(e => e.Note)
                .HasMaxLength(500)
                .HasColumnName("note");
            entity.Property(e => e.PersonGuid)
                .HasMaxLength(255)
                .HasColumnName("person_guid");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .HasColumnName("title");
        });

        modelBuilder.Entity<PersonTag>(entity =>
        {
            entity.HasKey(e => new { e.PersonId, e.TagId });

            entity.ToTable("person_tag");

            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");
        });

        modelBuilder.Entity<Record>(entity =>
        {
            entity.ToTable("record");

            entity.HasIndex(e => e.CameraId, "IX_record_camera_id");

            entity.HasIndex(e => e.LogTime, "IX_record_log_time");

            entity.HasIndex(e => e.LogTime, "IX_record_log_time_last_modified");

            entity.HasIndex(e => new { e.LogTime, e.LivenessResult }, "IX_record_log_time_liveness");

            entity.HasIndex(e => e.PersonId, "IX_record_person_id");

            entity.HasIndex(e => new { e.PersonId, e.LogTime }, "IX_record_person_id_log_time");

            entity.HasIndex(e => new { e.PersonId, e.LogTime, e.LivenessResult }, "IX_record_person_log_time_last_modified");

            entity.HasIndex(e => new { e.CameraId, e.IsQualified, e.LogTime }, "IX_record_reid_search");

            entity.HasIndex(e => new { e.CameraId, e.LogTime, e.LivenessResult }, "IX_record_visitor_list");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.BoundingBox)
                .HasMaxLength(100)
                .HasColumnName("bounding_box");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DebugData).HasColumnName("debug_data");
            entity.Property(e => e.FaceId).HasColumnName("face_id");
            entity.Property(e => e.IsQualified)
                .HasDefaultValueSql("((1))")
                .HasColumnName("is_qualified");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.LivenessResult).HasColumnName("liveness_result");
            entity.Property(e => e.LogTime)
                .HasColumnType("datetime")
                .HasColumnName("log_time");
            entity.Property(e => e.OcclusionType).HasColumnName("occlusion_type");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.Similarity).HasColumnName("similarity");
            entity.Property(e => e.Temperature).HasColumnName("temperature");
            entity.Property(e => e.VmsCameraId)
                .HasMaxLength(200)
                .HasColumnName("vms_camera_id");
            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
        });

        modelBuilder.Entity<RecordClipId>(entity =>
        {
            entity.HasKey(e => new { e.RecordId, e.ClipId });

            entity.ToTable("record_clip_id");

            entity.HasIndex(e => e.ClipId, "IX_record_clip_id");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.ClipId).HasColumnName("clip_id");
        });

        modelBuilder.Entity<RecordSnapshot>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("record_snapshot");

            entity.Property(e => e.RecordId)
                .ValueGeneratedNever()
                .HasColumnName("record_id");
            entity.Property(e => e.Snapshot).HasColumnName("snapshot");
        });

        modelBuilder.Entity<RecordTemplate>(entity =>
        {
            entity.HasKey(e => new { e.RecordId, e.FeatureType });

            entity.ToTable("record_template");

            entity.HasIndex(e => e.CameraId, "IX_record_template_camera_id");

            entity.HasIndex(e => new { e.FeatureType, e.CameraId, e.LogTime }, "IX_record_template_feature_type");

            entity.HasIndex(e => e.LogTime, "IX_record_template_log_time");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.FeatureType).HasColumnName("feature_type");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.FaceFeature).HasColumnName("face_feature");
            entity.Property(e => e.LogTime)
                .HasColumnType("datetime")
                .HasColumnName("log_time");
            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
        });

        modelBuilder.Entity<RecordingServer>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("recording_server");

            entity.Property(e => e.IsDeleted)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_deleted");
            entity.Property(e => e.RecorderId)
                .HasMaxLength(100)
                .HasColumnName("recorder_id");
            entity.Property(e => e.RecordingServerId)
                .ValueGeneratedOnAdd()
                .HasColumnName("recording_server_id");
            entity.Property(e => e.RecordingServerName)
                .HasMaxLength(100)
                .HasColumnName("recording_server_name");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.CameraGroupId).HasColumnName("camera_group_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Note)
                .HasMaxLength(255)
                .HasColumnName("note");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.Permission });

            entity.ToTable("role_permission");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Permission)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("permission");
        });

        modelBuilder.Entity<Snapshot>(entity =>
        {
            entity.ToTable("snapshot");

            entity.HasIndex(e => e.FaceId, "IX_snapshot_face_id");

            entity.HasIndex(e => e.PersonId, "IX_snapshot_person_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.EnrollType).HasColumnName("enroll_type");
            entity.Property(e => e.FaceId).HasColumnName("face_id");
            entity.Property(e => e.IsSelected)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_selected");
            entity.Property(e => e.IsSimilarFace).HasColumnName("is_similar_face");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.SimilarPersonId).HasColumnName("similar_person_id");
            entity.Property(e => e.Snapshot1).HasColumnName("snapshot");
            entity.Property(e => e.Source)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("source");
            entity.Property(e => e.UploadedFacesCoverPhoto).HasColumnName("uploaded_faces_cover_photo");
            entity.Property(e => e.UploadedFacesInfo)
                .HasMaxLength(2000)
                .HasColumnName("uploaded_faces_info");
            entity.Property(e => e.UploadedFacesSnapshotIds)
                .HasMaxLength(100)
                .HasColumnName("uploaded_faces_snapshot_ids");
        });

        modelBuilder.Entity<TmpPersonTemplate>(entity =>
        {
            entity.HasKey(e => e.TmpId);

            entity.ToTable("tmp_person_template");

            entity.HasIndex(e => new { e.PersonId, e.FeatureType, e.FeatureSubType }, "IX_tmp_person_id");

            entity.Property(e => e.TmpId).HasColumnName("tmp_id");
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_time");
            entity.Property(e => e.FaceFeature).HasColumnName("face_feature");
            entity.Property(e => e.FeatureSubType).HasColumnName("feature_sub_type");
            entity.Property(e => e.FeatureType).HasColumnName("feature_type");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
        });

        modelBuilder.Entity<UGroup>(entity =>
        {
            entity.ToTable("u_groups");

            entity.HasIndex(e => e.UGroupId, "IX_u_groups");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.InviteUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("invite_url");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.UGroupId).HasColumnName("u_group_id");
        });

        modelBuilder.Entity<VisitorSummary>(entity =>
        {
            entity.HasKey(e => new { e.SummarizedDate, e.PersonId });

            entity.ToTable("visitor_summary");

            entity.Property(e => e.SummarizedDate)
                .HasColumnType("date")
                .HasColumnName("summarized_date");
            entity.Property(e => e.PersonId).HasColumnName("person_id");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.OcclusionType).HasColumnName("occlusion_type");
            entity.Property(e => e.VisitCount).HasColumnName("visit_count");
        });

        modelBuilder.Entity<VmsEventRule>(entity =>
        {
            entity.HasKey(e => e.RuleId);

            entity.ToTable("vms_event_rule");

            entity.Property(e => e.RuleId).HasColumnName("rule_id");
            entity.Property(e => e.Enabled)
                .HasDefaultValueSql("((1))")
                .HasColumnName("enabled");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SpecificGroup)
                .HasDefaultValueSql("((1))")
                .HasColumnName("specific_group");
            entity.Property(e => e.SpecificTime)
                .HasDefaultValueSql("((1))")
                .HasColumnName("specific_time");
            entity.Property(e => e.TriggerTime)
                .HasMaxLength(100)
                .HasDefaultValueSql("('{\"weekDay\":[0,1,2,3,4,5,6],\"startHour\":0,\"endHour\":0}')")
                .HasColumnName("trigger_time");
        });

        modelBuilder.Entity<VmsEventRuleCamera>(entity =>
        {
            entity.HasKey(e => new { e.RuleId, e.CameraId });

            entity.ToTable("vms_event_rule_camera");

            entity.HasIndex(e => e.CameraId, "IX_vms_event_rule_camera");

            entity.Property(e => e.RuleId).HasColumnName("rule_id");
            entity.Property(e => e.CameraId).HasColumnName("camera_id");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
        });

        modelBuilder.Entity<VmsEventRuleGroup>(entity =>
        {
            entity.HasKey(e => new { e.RuleId, e.GroupId, e.TagId });

            entity.ToTable("vms_event_rule_group");

            entity.HasIndex(e => new { e.GroupId, e.TagId }, "IX_vms_event_rule_group");

            entity.Property(e => e.RuleId).HasColumnName("rule_id");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
        });

        modelBuilder.Entity<VmsPersonEnrollRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("vms_person_enroll_record");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.Email)
                .HasMaxLength(500)
                .HasColumnName("email");
            entity.Property(e => e.EnrollDate)
                .HasColumnType("datetime")
                .HasColumnName("enroll_date");
            entity.Property(e => e.EnrollResult)
                .HasMaxLength(255)
                .HasColumnName("enroll_result");
            entity.Property(e => e.PersonGuid)
                .HasMaxLength(255)
                .HasColumnName("person_guid");
            entity.Property(e => e.PersonName)
                .HasMaxLength(255)
                .HasColumnName("person_name");
        });

        modelBuilder.Entity<WorkstationCentral>(entity =>
        {
            entity.HasKey(e => new { e.WorkstationId, e.CentralId });

            entity.ToTable("workstation_central");

            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
            entity.Property(e => e.CentralId).HasColumnName("central_id");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.UsedIp)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("used_ip");
        });

        modelBuilder.Entity<WorkstationInfo>(entity =>
        {
            entity.HasKey(e => e.WorkstationId);

            entity.ToTable("workstation_info");

            entity.HasIndex(e => e.BackupPrimaryId, "IX_workstation_backup_primary_id");

            entity.HasIndex(e => e.DeviceId, "IX_workstation_device_id");

            entity.HasIndex(e => new { e.WorkstationId, e.Type }, "IX_workstation_type");

            entity.Property(e => e.WorkstationId).HasColumnName("workstation_id");
            entity.Property(e => e.BackupEnabled).HasColumnName("backup_enabled");
            entity.Property(e => e.BackupPrimaryId).HasColumnName("backup_primary_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DeviceId)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("device_id");
            entity.Property(e => e.ExtraData)
                .HasMaxLength(4000)
                .HasColumnName("extra_data");
            entity.Property(e => e.IntranetIp)
                .HasMaxLength(256)
                .HasColumnName("intranet_ip");
            entity.Property(e => e.IsSignedIn).HasColumnName("is_signed_in");
            entity.Property(e => e.LastAlive)
                .HasColumnType("datetime")
                .HasColumnName("last_alive");
            entity.Property(e => e.LastModified)
                .HasColumnType("datetime")
                .HasColumnName("last_modified");
            entity.Property(e => e.Mode).HasColumnName("mode");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
            entity.Property(e => e.PublicIp)
                .HasMaxLength(256)
                .HasColumnName("public_ip");
            entity.Property(e => e.RelayEnabled).HasColumnName("relay_enabled");
            entity.Property(e => e.RelayPort).HasColumnName("relay_port");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("('NORMAL')")
                .HasColumnName("type");
            entity.Property(e => e.VersionCode).HasColumnName("version_code");
            entity.Property(e => e.VersionName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("version_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
