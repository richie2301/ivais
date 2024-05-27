PGDMP         "    	            |            ignis    15.4    15.4 r    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    28046    ignis    DATABASE     �   CREATE DATABASE ignis WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE ignis;
                postgres    false            �            1259    28052    Activity    TABLE     �   CREATE TABLE public."Activity" (
    "ActivityId" text NOT NULL,
    "Type" text NOT NULL,
    "Action" text NOT NULL,
    "Description" text NOT NULL
);
    DROP TABLE public."Activity";
       public         heap    postgres    false            �            1259    28073    Case    TABLE     8  CREATE TABLE public."Case" (
    "CaseId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "Title" text NOT NULL,
    "Objective" text,
    "CollaboratorUserId" text[] NOT NULL,
    "ExecutiveSummary" text,
    "Conclusion" text,
    "StartTime" bigint,
    "EndTime" bigint,
    "PersonNumber" double precision[] NOT NULL,
    "GeneralAttribute" text[] NOT NULL,
    "ColorAttribute" text[] NOT NULL,
    "TagId" text[] NOT NULL,
    "Status" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Case";
       public         heap    postgres    false            �            1259    28138    CaseActivity    TABLE       CREATE TABLE public."CaseActivity" (
    "CaseActivityId" text NOT NULL,
    "CaseId" text NOT NULL,
    "ActivityId" text NOT NULL,
    "RelatedId" text,
    "RelatedData" text,
    "UserId" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);
 "   DROP TABLE public."CaseActivity";
       public         heap    postgres    false            �            1259    28233    CaseTag    TABLE     b   CREATE TABLE public."CaseTag" (
    "CasesCaseId" text NOT NULL,
    "TagsTagId" text NOT NULL
);
    DROP TABLE public."CaseTag";
       public         heap    postgres    false            �            1259    28085    Evidence    TABLE     4  CREATE TABLE public."Evidence" (
    "EvidenceId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "EvidenceSourceId" text NOT NULL,
    "EvidenceDocumentId" text NOT NULL,
    "Type" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Evidence";
       public         heap    postgres    false            �            1259    28160    EvidenceActivity    TABLE     �   CREATE TABLE public."EvidenceActivity" (
    "EvidenceActivityId" text NOT NULL,
    "EvidenceId" text NOT NULL,
    "ActivityId" text NOT NULL,
    "RelatedId" text,
    "UserId" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);
 &   DROP TABLE public."EvidenceActivity";
       public         heap    postgres    false            �            1259    28182    EvidenceAnalytic    TABLE     �  CREATE TABLE public."EvidenceAnalytic" (
    "EvidenceAnalyticId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "EvidenceId" text NOT NULL,
    "StartTime" timestamp with time zone NOT NULL,
    "EndTime" timestamp with time zone NOT NULL,
    "Notes" text NOT NULL,
    "Level" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
 &   DROP TABLE public."EvidenceAnalytic";
       public         heap    postgres    false            �            1259    28216    EvidenceMission    TABLE     z   CREATE TABLE public."EvidenceMission" (
    "EvidencesEvidenceId" text NOT NULL,
    "MissionsMissionId" text NOT NULL
);
 %   DROP TABLE public."EvidenceMission";
       public         heap    postgres    false            �            1259    28059    EvidenceSource    TABLE     i   CREATE TABLE public."EvidenceSource" (
    "EvidenceSourceId" text NOT NULL,
    "Name" text NOT NULL
);
 $   DROP TABLE public."EvidenceSource";
       public         heap    postgres    false            �            1259    28250    EvidenceTag    TABLE     n   CREATE TABLE public."EvidenceTag" (
    "EvidencesEvidenceId" text NOT NULL,
    "TagsTagId" text NOT NULL
);
 !   DROP TABLE public."EvidenceTag";
       public         heap    postgres    false            �            1259    28267     FaceRecognitionDataTimeSeriesTag    TABLE     �   CREATE TABLE public."FaceRecognitionDataTimeSeriesTag" (
    "TagId" text NOT NULL,
    "FaceRecognitionDataTimestamp" timestamp with time zone NOT NULL,
    "DocumentId" text NOT NULL
);
 6   DROP TABLE public."FaceRecognitionDataTimeSeriesTag";
       public         heap    postgres    false            �            1259    28102    Mission    TABLE        CREATE TABLE public."Mission" (
    "MissionId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "Name" text NOT NULL,
    "Status" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Mission";
       public         heap    postgres    false            �            1259    28279 
   MissionTag    TABLE     k   CREATE TABLE public."MissionTag" (
    "MissionsMissionId" text NOT NULL,
    "TagsTagId" text NOT NULL
);
     DROP TABLE public."MissionTag";
       public         heap    postgres    false            �            1259    28296     PeopleAttributeDataTimeSeriesTag    TABLE     �   CREATE TABLE public."PeopleAttributeDataTimeSeriesTag" (
    "TagId" text NOT NULL,
    "PeopleAttributeDataTimestamp" timestamp with time zone NOT NULL,
    "DocumentId" text NOT NULL
);
 6   DROP TABLE public."PeopleAttributeDataTimeSeriesTag";
       public         heap    postgres    false            �            1259    28114    Person    TABLE     �  CREATE TABLE public."Person" (
    "PersonId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "PersonNumber" integer NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Group" text NOT NULL,
    "SubGroups" text[] NOT NULL,
    "Company" text NOT NULL,
    "Role" text NOT NULL,
    "Notes" text,
    "ProfilePictureUrl" text,
    "FaceUrls" text[] NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Person";
       public         heap    postgres    false            �            1259    28308    RelationCaseEvidenceAnalytics    TABLE     u  CREATE TABLE public."RelationCaseEvidenceAnalytics" (
    "Id" text NOT NULL,
    "RelationCaseEvidenceId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "StartTime" timestamp with time zone,
    "EndTime" timestamp with time zone,
    "Notes" text,
    "Level" integer NOT NULL,
    "CreatedAt" timestamp with time zone,
    "UpdatedAt" timestamp with time zone
);
 3   DROP TABLE public."RelationCaseEvidenceAnalytics";
       public         heap    postgres    false            �            1259    28199    RelationCaseEvidences    TABLE     �   CREATE TABLE public."RelationCaseEvidences" (
    "Id" text NOT NULL,
    "CaseId" text,
    "EvidenceId" text,
    "Status" text
);
 +   DROP TABLE public."RelationCaseEvidences";
       public         heap    postgres    false            �            1259    28126    Tag    TABLE     �   CREATE TABLE public."Tag" (
    "TagId" text NOT NULL,
    "CreatorUserId" text NOT NULL,
    "Name" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Tag";
       public         heap    postgres    false            �            1259    28066    User    TABLE     �  CREATE TABLE public."User" (
    "UserId" text NOT NULL,
    "FirstName" text NOT NULL,
    "LastName" text NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" bytea NOT NULL,
    "PasswordSalt" bytea NOT NULL,
    "VerificationToken" text NOT NULL,
    "VerifiedAt" timestamp with time zone,
    "PasswordResetToken" text,
    "ResetTokenExpired" timestamp with time zone,
    "Type" text NOT NULL,
    "PhoneNumber" text,
    "Address" text,
    "ProfilePictureUrl" text,
    "Status" text NOT NULL,
    "LastLogin" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."User";
       public         heap    postgres    false            �            1259    28047    __EFMigrationsHistory    TABLE     �   CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);
 +   DROP TABLE public."__EFMigrationsHistory";
       public         heap    postgres    false            �          0    28052    Activity 
   TABLE DATA           S   COPY public."Activity" ("ActivityId", "Type", "Action", "Description") FROM stdin;
    public          postgres    false    215   �       �          0    28073    Case 
   TABLE DATA             COPY public."Case" ("CaseId", "CreatorUserId", "Title", "Objective", "CollaboratorUserId", "ExecutiveSummary", "Conclusion", "StartTime", "EndTime", "PersonNumber", "GeneralAttribute", "ColorAttribute", "TagId", "Status", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    218   ժ       �          0    28138    CaseActivity 
   TABLE DATA           �   COPY public."CaseActivity" ("CaseActivityId", "CaseId", "ActivityId", "RelatedId", "RelatedData", "UserId", "CreatedAt") FROM stdin;
    public          postgres    false    223   �       �          0    28233    CaseTag 
   TABLE DATA           ?   COPY public."CaseTag" ("CasesCaseId", "TagsTagId") FROM stdin;
    public          postgres    false    228   �       �          0    28085    Evidence 
   TABLE DATA           �   COPY public."Evidence" ("EvidenceId", "CreatorUserId", "EvidenceSourceId", "EvidenceDocumentId", "Type", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    219   ,�       �          0    28160    EvidenceActivity 
   TABLE DATA           �   COPY public."EvidenceActivity" ("EvidenceActivityId", "EvidenceId", "ActivityId", "RelatedId", "UserId", "CreatedAt") FROM stdin;
    public          postgres    false    224   I�       �          0    28182    EvidenceAnalytic 
   TABLE DATA           �   COPY public."EvidenceAnalytic" ("EvidenceAnalyticId", "CreatorUserId", "EvidenceId", "StartTime", "EndTime", "Notes", "Level", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    225   f�       �          0    28216    EvidenceMission 
   TABLE DATA           W   COPY public."EvidenceMission" ("EvidencesEvidenceId", "MissionsMissionId") FROM stdin;
    public          postgres    false    227   ��       �          0    28059    EvidenceSource 
   TABLE DATA           F   COPY public."EvidenceSource" ("EvidenceSourceId", "Name") FROM stdin;
    public          postgres    false    216   ��       �          0    28250    EvidenceTag 
   TABLE DATA           K   COPY public."EvidenceTag" ("EvidencesEvidenceId", "TagsTagId") FROM stdin;
    public          postgres    false    229   J�       �          0    28267     FaceRecognitionDataTimeSeriesTag 
   TABLE DATA           s   COPY public."FaceRecognitionDataTimeSeriesTag" ("TagId", "FaceRecognitionDataTimestamp", "DocumentId") FROM stdin;
    public          postgres    false    230   g�       �          0    28102    Mission 
   TABLE DATA           m   COPY public."Mission" ("MissionId", "CreatorUserId", "Name", "Status", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    220   ��       �          0    28279 
   MissionTag 
   TABLE DATA           H   COPY public."MissionTag" ("MissionsMissionId", "TagsTagId") FROM stdin;
    public          postgres    false    231   ��       �          0    28296     PeopleAttributeDataTimeSeriesTag 
   TABLE DATA           s   COPY public."PeopleAttributeDataTimeSeriesTag" ("TagId", "PeopleAttributeDataTimestamp", "DocumentId") FROM stdin;
    public          postgres    false    232   ��       �          0    28114    Person 
   TABLE DATA           �   COPY public."Person" ("PersonId", "CreatorUserId", "PersonNumber", "Name", "Email", "Group", "SubGroups", "Company", "Role", "Notes", "ProfilePictureUrl", "FaceUrls", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    221   ۬       �          0    28308    RelationCaseEvidenceAnalytics 
   TABLE DATA           �   COPY public."RelationCaseEvidenceAnalytics" ("Id", "RelationCaseEvidenceId", "CreatorUserId", "StartTime", "EndTime", "Notes", "Level", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    233   ��       �          0    28199    RelationCaseEvidences 
   TABLE DATA           Y   COPY public."RelationCaseEvidences" ("Id", "CaseId", "EvidenceId", "Status") FROM stdin;
    public          postgres    false    226   �       �          0    28126    Tag 
   TABLE DATA           [   COPY public."Tag" ("TagId", "CreatorUserId", "Name", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    222   2�       �          0    28066    User 
   TABLE DATA           "  COPY public."User" ("UserId", "FirstName", "LastName", "Email", "PasswordHash", "PasswordSalt", "VerificationToken", "VerifiedAt", "PasswordResetToken", "ResetTokenExpired", "Type", "PhoneNumber", "Address", "ProfilePictureUrl", "Status", "LastLogin", "CreatedAt", "UpdatedAt") FROM stdin;
    public          postgres    false    217   O�       �          0    28047    __EFMigrationsHistory 
   TABLE DATA           R   COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
    public          postgres    false    214   *�       �           2606    28058    Activity PK_Activity 
   CONSTRAINT     `   ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "PK_Activity" PRIMARY KEY ("ActivityId");
 B   ALTER TABLE ONLY public."Activity" DROP CONSTRAINT "PK_Activity";
       public            postgres    false    215            �           2606    28079    Case PK_Case 
   CONSTRAINT     T   ALTER TABLE ONLY public."Case"
    ADD CONSTRAINT "PK_Case" PRIMARY KEY ("CaseId");
 :   ALTER TABLE ONLY public."Case" DROP CONSTRAINT "PK_Case";
       public            postgres    false    218            �           2606    28144    CaseActivity PK_CaseActivity 
   CONSTRAINT     l   ALTER TABLE ONLY public."CaseActivity"
    ADD CONSTRAINT "PK_CaseActivity" PRIMARY KEY ("CaseActivityId");
 J   ALTER TABLE ONLY public."CaseActivity" DROP CONSTRAINT "PK_CaseActivity";
       public            postgres    false    223            �           2606    28239    CaseTag PK_CaseTag 
   CONSTRAINT     l   ALTER TABLE ONLY public."CaseTag"
    ADD CONSTRAINT "PK_CaseTag" PRIMARY KEY ("CasesCaseId", "TagsTagId");
 @   ALTER TABLE ONLY public."CaseTag" DROP CONSTRAINT "PK_CaseTag";
       public            postgres    false    228    228            �           2606    28091    Evidence PK_Evidence 
   CONSTRAINT     `   ALTER TABLE ONLY public."Evidence"
    ADD CONSTRAINT "PK_Evidence" PRIMARY KEY ("EvidenceId");
 B   ALTER TABLE ONLY public."Evidence" DROP CONSTRAINT "PK_Evidence";
       public            postgres    false    219            �           2606    28166 $   EvidenceActivity PK_EvidenceActivity 
   CONSTRAINT     x   ALTER TABLE ONLY public."EvidenceActivity"
    ADD CONSTRAINT "PK_EvidenceActivity" PRIMARY KEY ("EvidenceActivityId");
 R   ALTER TABLE ONLY public."EvidenceActivity" DROP CONSTRAINT "PK_EvidenceActivity";
       public            postgres    false    224            �           2606    28188 $   EvidenceAnalytic PK_EvidenceAnalytic 
   CONSTRAINT     x   ALTER TABLE ONLY public."EvidenceAnalytic"
    ADD CONSTRAINT "PK_EvidenceAnalytic" PRIMARY KEY ("EvidenceAnalyticId");
 R   ALTER TABLE ONLY public."EvidenceAnalytic" DROP CONSTRAINT "PK_EvidenceAnalytic";
       public            postgres    false    225            �           2606    28222 "   EvidenceMission PK_EvidenceMission 
   CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceMission"
    ADD CONSTRAINT "PK_EvidenceMission" PRIMARY KEY ("EvidencesEvidenceId", "MissionsMissionId");
 P   ALTER TABLE ONLY public."EvidenceMission" DROP CONSTRAINT "PK_EvidenceMission";
       public            postgres    false    227    227            �           2606    28065     EvidenceSource PK_EvidenceSource 
   CONSTRAINT     r   ALTER TABLE ONLY public."EvidenceSource"
    ADD CONSTRAINT "PK_EvidenceSource" PRIMARY KEY ("EvidenceSourceId");
 N   ALTER TABLE ONLY public."EvidenceSource" DROP CONSTRAINT "PK_EvidenceSource";
       public            postgres    false    216            �           2606    28256    EvidenceTag PK_EvidenceTag 
   CONSTRAINT     |   ALTER TABLE ONLY public."EvidenceTag"
    ADD CONSTRAINT "PK_EvidenceTag" PRIMARY KEY ("EvidencesEvidenceId", "TagsTagId");
 H   ALTER TABLE ONLY public."EvidenceTag" DROP CONSTRAINT "PK_EvidenceTag";
       public            postgres    false    229    229            �           2606    28273 D   FaceRecognitionDataTimeSeriesTag PK_FaceRecognitionDataTimeSeriesTag 
   CONSTRAINT     �   ALTER TABLE ONLY public."FaceRecognitionDataTimeSeriesTag"
    ADD CONSTRAINT "PK_FaceRecognitionDataTimeSeriesTag" PRIMARY KEY ("TagId", "FaceRecognitionDataTimestamp", "DocumentId");
 r   ALTER TABLE ONLY public."FaceRecognitionDataTimeSeriesTag" DROP CONSTRAINT "PK_FaceRecognitionDataTimeSeriesTag";
       public            postgres    false    230    230    230            �           2606    28108    Mission PK_Mission 
   CONSTRAINT     ]   ALTER TABLE ONLY public."Mission"
    ADD CONSTRAINT "PK_Mission" PRIMARY KEY ("MissionId");
 @   ALTER TABLE ONLY public."Mission" DROP CONSTRAINT "PK_Mission";
       public            postgres    false    220            �           2606    28285    MissionTag PK_MissionTag 
   CONSTRAINT     x   ALTER TABLE ONLY public."MissionTag"
    ADD CONSTRAINT "PK_MissionTag" PRIMARY KEY ("MissionsMissionId", "TagsTagId");
 F   ALTER TABLE ONLY public."MissionTag" DROP CONSTRAINT "PK_MissionTag";
       public            postgres    false    231    231            �           2606    28302 D   PeopleAttributeDataTimeSeriesTag PK_PeopleAttributeDataTimeSeriesTag 
   CONSTRAINT     �   ALTER TABLE ONLY public."PeopleAttributeDataTimeSeriesTag"
    ADD CONSTRAINT "PK_PeopleAttributeDataTimeSeriesTag" PRIMARY KEY ("TagId", "PeopleAttributeDataTimestamp", "DocumentId");
 r   ALTER TABLE ONLY public."PeopleAttributeDataTimeSeriesTag" DROP CONSTRAINT "PK_PeopleAttributeDataTimeSeriesTag";
       public            postgres    false    232    232    232            �           2606    28120    Person PK_Person 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "PK_Person" PRIMARY KEY ("PersonId");
 >   ALTER TABLE ONLY public."Person" DROP CONSTRAINT "PK_Person";
       public            postgres    false    221            �           2606    28314 >   RelationCaseEvidenceAnalytics PK_RelationCaseEvidenceAnalytics 
   CONSTRAINT     �   ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics"
    ADD CONSTRAINT "PK_RelationCaseEvidenceAnalytics" PRIMARY KEY ("Id");
 l   ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics" DROP CONSTRAINT "PK_RelationCaseEvidenceAnalytics";
       public            postgres    false    233            �           2606    28205 .   RelationCaseEvidences PK_RelationCaseEvidences 
   CONSTRAINT     r   ALTER TABLE ONLY public."RelationCaseEvidences"
    ADD CONSTRAINT "PK_RelationCaseEvidences" PRIMARY KEY ("Id");
 \   ALTER TABLE ONLY public."RelationCaseEvidences" DROP CONSTRAINT "PK_RelationCaseEvidences";
       public            postgres    false    226            �           2606    28132 
   Tag PK_Tag 
   CONSTRAINT     Q   ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "PK_Tag" PRIMARY KEY ("TagId");
 8   ALTER TABLE ONLY public."Tag" DROP CONSTRAINT "PK_Tag";
       public            postgres    false    222            �           2606    28072    User PK_User 
   CONSTRAINT     T   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_User" PRIMARY KEY ("UserId");
 :   ALTER TABLE ONLY public."User" DROP CONSTRAINT "PK_User";
       public            postgres    false    217            �           2606    28051 .   __EFMigrationsHistory PK___EFMigrationsHistory 
   CONSTRAINT     {   ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");
 \   ALTER TABLE ONLY public."__EFMigrationsHistory" DROP CONSTRAINT "PK___EFMigrationsHistory";
       public            postgres    false    214            �           1259    28326    IX_CaseActivity_ActivityId    INDEX     _   CREATE INDEX "IX_CaseActivity_ActivityId" ON public."CaseActivity" USING btree ("ActivityId");
 0   DROP INDEX public."IX_CaseActivity_ActivityId";
       public            postgres    false    223            �           1259    28327    IX_CaseActivity_CaseId    INDEX     W   CREATE INDEX "IX_CaseActivity_CaseId" ON public."CaseActivity" USING btree ("CaseId");
 ,   DROP INDEX public."IX_CaseActivity_CaseId";
       public            postgres    false    223            �           1259    28328    IX_CaseActivity_UserId    INDEX     W   CREATE INDEX "IX_CaseActivity_UserId" ON public."CaseActivity" USING btree ("UserId");
 ,   DROP INDEX public."IX_CaseActivity_UserId";
       public            postgres    false    223            �           1259    28329    IX_CaseTag_TagsTagId    INDEX     S   CREATE INDEX "IX_CaseTag_TagsTagId" ON public."CaseTag" USING btree ("TagsTagId");
 *   DROP INDEX public."IX_CaseTag_TagsTagId";
       public            postgres    false    228            �           1259    28325    IX_Case_CreatorUserId    INDEX     U   CREATE INDEX "IX_Case_CreatorUserId" ON public."Case" USING btree ("CreatorUserId");
 +   DROP INDEX public."IX_Case_CreatorUserId";
       public            postgres    false    218            �           1259    28332    IX_EvidenceActivity_ActivityId    INDEX     g   CREATE INDEX "IX_EvidenceActivity_ActivityId" ON public."EvidenceActivity" USING btree ("ActivityId");
 4   DROP INDEX public."IX_EvidenceActivity_ActivityId";
       public            postgres    false    224            �           1259    28333    IX_EvidenceActivity_EvidenceId    INDEX     g   CREATE INDEX "IX_EvidenceActivity_EvidenceId" ON public."EvidenceActivity" USING btree ("EvidenceId");
 4   DROP INDEX public."IX_EvidenceActivity_EvidenceId";
       public            postgres    false    224            �           1259    28334    IX_EvidenceActivity_UserId    INDEX     _   CREATE INDEX "IX_EvidenceActivity_UserId" ON public."EvidenceActivity" USING btree ("UserId");
 0   DROP INDEX public."IX_EvidenceActivity_UserId";
       public            postgres    false    224            �           1259    28335 !   IX_EvidenceAnalytic_CreatorUserId    INDEX     m   CREATE INDEX "IX_EvidenceAnalytic_CreatorUserId" ON public."EvidenceAnalytic" USING btree ("CreatorUserId");
 7   DROP INDEX public."IX_EvidenceAnalytic_CreatorUserId";
       public            postgres    false    225            �           1259    28336    IX_EvidenceAnalytic_EvidenceId    INDEX     g   CREATE INDEX "IX_EvidenceAnalytic_EvidenceId" ON public."EvidenceAnalytic" USING btree ("EvidenceId");
 4   DROP INDEX public."IX_EvidenceAnalytic_EvidenceId";
       public            postgres    false    225            �           1259    28337 $   IX_EvidenceMission_MissionsMissionId    INDEX     s   CREATE INDEX "IX_EvidenceMission_MissionsMissionId" ON public."EvidenceMission" USING btree ("MissionsMissionId");
 :   DROP INDEX public."IX_EvidenceMission_MissionsMissionId";
       public            postgres    false    227            �           1259    28338    IX_EvidenceTag_TagsTagId    INDEX     [   CREATE INDEX "IX_EvidenceTag_TagsTagId" ON public."EvidenceTag" USING btree ("TagsTagId");
 .   DROP INDEX public."IX_EvidenceTag_TagsTagId";
       public            postgres    false    229            �           1259    28330    IX_Evidence_CreatorUserId    INDEX     ]   CREATE INDEX "IX_Evidence_CreatorUserId" ON public."Evidence" USING btree ("CreatorUserId");
 /   DROP INDEX public."IX_Evidence_CreatorUserId";
       public            postgres    false    219            �           1259    28331    IX_Evidence_EvidenceSourceId    INDEX     c   CREATE INDEX "IX_Evidence_EvidenceSourceId" ON public."Evidence" USING btree ("EvidenceSourceId");
 2   DROP INDEX public."IX_Evidence_EvidenceSourceId";
       public            postgres    false    219            �           1259    28340    IX_MissionTag_TagsTagId    INDEX     Y   CREATE INDEX "IX_MissionTag_TagsTagId" ON public."MissionTag" USING btree ("TagsTagId");
 -   DROP INDEX public."IX_MissionTag_TagsTagId";
       public            postgres    false    231            �           1259    28339    IX_Mission_CreatorUserId    INDEX     [   CREATE INDEX "IX_Mission_CreatorUserId" ON public."Mission" USING btree ("CreatorUserId");
 .   DROP INDEX public."IX_Mission_CreatorUserId";
       public            postgres    false    220            �           1259    28341    IX_Person_CreatorUserId    INDEX     Y   CREATE INDEX "IX_Person_CreatorUserId" ON public."Person" USING btree ("CreatorUserId");
 -   DROP INDEX public."IX_Person_CreatorUserId";
       public            postgres    false    221            �           1259    28342 .   IX_RelationCaseEvidenceAnalytics_CreatorUserId    INDEX     �   CREATE INDEX "IX_RelationCaseEvidenceAnalytics_CreatorUserId" ON public."RelationCaseEvidenceAnalytics" USING btree ("CreatorUserId");
 D   DROP INDEX public."IX_RelationCaseEvidenceAnalytics_CreatorUserId";
       public            postgres    false    233            �           1259    28343 7   IX_RelationCaseEvidenceAnalytics_RelationCaseEvidenceId    INDEX     �   CREATE INDEX "IX_RelationCaseEvidenceAnalytics_RelationCaseEvidenceId" ON public."RelationCaseEvidenceAnalytics" USING btree ("RelationCaseEvidenceId");
 M   DROP INDEX public."IX_RelationCaseEvidenceAnalytics_RelationCaseEvidenceId";
       public            postgres    false    233            �           1259    28344    IX_RelationCaseEvidences_CaseId    INDEX     i   CREATE INDEX "IX_RelationCaseEvidences_CaseId" ON public."RelationCaseEvidences" USING btree ("CaseId");
 5   DROP INDEX public."IX_RelationCaseEvidences_CaseId";
       public            postgres    false    226            �           1259    28345 #   IX_RelationCaseEvidences_EvidenceId    INDEX     q   CREATE INDEX "IX_RelationCaseEvidences_EvidenceId" ON public."RelationCaseEvidences" USING btree ("EvidenceId");
 9   DROP INDEX public."IX_RelationCaseEvidences_EvidenceId";
       public            postgres    false    226            �           1259    28346    IX_Tag_CreatorUserId    INDEX     S   CREATE INDEX "IX_Tag_CreatorUserId" ON public."Tag" USING btree ("CreatorUserId");
 *   DROP INDEX public."IX_Tag_CreatorUserId";
       public            postgres    false    222            �           2606    28145 0   CaseActivity FK_CaseActivity_Activity_ActivityId    FK CONSTRAINT     �   ALTER TABLE ONLY public."CaseActivity"
    ADD CONSTRAINT "FK_CaseActivity_Activity_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES public."Activity"("ActivityId") ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public."CaseActivity" DROP CONSTRAINT "FK_CaseActivity_Activity_ActivityId";
       public          postgres    false    3251    215    223            �           2606    28150 (   CaseActivity FK_CaseActivity_Case_CaseId    FK CONSTRAINT     �   ALTER TABLE ONLY public."CaseActivity"
    ADD CONSTRAINT "FK_CaseActivity_Case_CaseId" FOREIGN KEY ("CaseId") REFERENCES public."Case"("CaseId") ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."CaseActivity" DROP CONSTRAINT "FK_CaseActivity_Case_CaseId";
       public          postgres    false    3258    218    223            �           2606    28155 (   CaseActivity FK_CaseActivity_User_UserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."CaseActivity"
    ADD CONSTRAINT "FK_CaseActivity_User_UserId" FOREIGN KEY ("UserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."CaseActivity" DROP CONSTRAINT "FK_CaseActivity_User_UserId";
       public          postgres    false    217    3255    223                        2606    28240 #   CaseTag FK_CaseTag_Case_CasesCaseId    FK CONSTRAINT     �   ALTER TABLE ONLY public."CaseTag"
    ADD CONSTRAINT "FK_CaseTag_Case_CasesCaseId" FOREIGN KEY ("CasesCaseId") REFERENCES public."Case"("CaseId") ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public."CaseTag" DROP CONSTRAINT "FK_CaseTag_Case_CasesCaseId";
       public          postgres    false    218    3258    228                       2606    28245     CaseTag FK_CaseTag_Tag_TagsTagId    FK CONSTRAINT     �   ALTER TABLE ONLY public."CaseTag"
    ADD CONSTRAINT "FK_CaseTag_Tag_TagsTagId" FOREIGN KEY ("TagsTagId") REFERENCES public."Tag"("TagId") ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."CaseTag" DROP CONSTRAINT "FK_CaseTag_Tag_TagsTagId";
       public          postgres    false    228    3271    222            �           2606    28080    Case FK_Case_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Case"
    ADD CONSTRAINT "FK_Case_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Case" DROP CONSTRAINT "FK_Case_User_CreatorUserId";
       public          postgres    false    3255    218    217            �           2606    28167 8   EvidenceActivity FK_EvidenceActivity_Activity_ActivityId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceActivity"
    ADD CONSTRAINT "FK_EvidenceActivity_Activity_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES public."Activity"("ActivityId") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."EvidenceActivity" DROP CONSTRAINT "FK_EvidenceActivity_Activity_ActivityId";
       public          postgres    false    215    224    3251            �           2606    28172 8   EvidenceActivity FK_EvidenceActivity_Evidence_EvidenceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceActivity"
    ADD CONSTRAINT "FK_EvidenceActivity_Evidence_EvidenceId" FOREIGN KEY ("EvidenceId") REFERENCES public."Evidence"("EvidenceId") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."EvidenceActivity" DROP CONSTRAINT "FK_EvidenceActivity_Evidence_EvidenceId";
       public          postgres    false    219    3262    224            �           2606    28177 0   EvidenceActivity FK_EvidenceActivity_User_UserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceActivity"
    ADD CONSTRAINT "FK_EvidenceActivity_User_UserId" FOREIGN KEY ("UserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public."EvidenceActivity" DROP CONSTRAINT "FK_EvidenceActivity_User_UserId";
       public          postgres    false    3255    224    217            �           2606    28189 8   EvidenceAnalytic FK_EvidenceAnalytic_Evidence_EvidenceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceAnalytic"
    ADD CONSTRAINT "FK_EvidenceAnalytic_Evidence_EvidenceId" FOREIGN KEY ("EvidenceId") REFERENCES public."Evidence"("EvidenceId") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."EvidenceAnalytic" DROP CONSTRAINT "FK_EvidenceAnalytic_Evidence_EvidenceId";
       public          postgres    false    225    3262    219            �           2606    28194 7   EvidenceAnalytic FK_EvidenceAnalytic_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceAnalytic"
    ADD CONSTRAINT "FK_EvidenceAnalytic_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 e   ALTER TABLE ONLY public."EvidenceAnalytic" DROP CONSTRAINT "FK_EvidenceAnalytic_User_CreatorUserId";
       public          postgres    false    3255    225    217            �           2606    28223 ?   EvidenceMission FK_EvidenceMission_Evidence_EvidencesEvidenceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceMission"
    ADD CONSTRAINT "FK_EvidenceMission_Evidence_EvidencesEvidenceId" FOREIGN KEY ("EvidencesEvidenceId") REFERENCES public."Evidence"("EvidenceId") ON DELETE CASCADE;
 m   ALTER TABLE ONLY public."EvidenceMission" DROP CONSTRAINT "FK_EvidenceMission_Evidence_EvidencesEvidenceId";
       public          postgres    false    219    3262    227            �           2606    28228 <   EvidenceMission FK_EvidenceMission_Mission_MissionsMissionId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceMission"
    ADD CONSTRAINT "FK_EvidenceMission_Mission_MissionsMissionId" FOREIGN KEY ("MissionsMissionId") REFERENCES public."Mission"("MissionId") ON DELETE CASCADE;
 j   ALTER TABLE ONLY public."EvidenceMission" DROP CONSTRAINT "FK_EvidenceMission_Mission_MissionsMissionId";
       public          postgres    false    227    3265    220                       2606    28257 7   EvidenceTag FK_EvidenceTag_Evidence_EvidencesEvidenceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceTag"
    ADD CONSTRAINT "FK_EvidenceTag_Evidence_EvidencesEvidenceId" FOREIGN KEY ("EvidencesEvidenceId") REFERENCES public."Evidence"("EvidenceId") ON DELETE CASCADE;
 e   ALTER TABLE ONLY public."EvidenceTag" DROP CONSTRAINT "FK_EvidenceTag_Evidence_EvidencesEvidenceId";
       public          postgres    false    229    3262    219                       2606    28262 (   EvidenceTag FK_EvidenceTag_Tag_TagsTagId    FK CONSTRAINT     �   ALTER TABLE ONLY public."EvidenceTag"
    ADD CONSTRAINT "FK_EvidenceTag_Tag_TagsTagId" FOREIGN KEY ("TagsTagId") REFERENCES public."Tag"("TagId") ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."EvidenceTag" DROP CONSTRAINT "FK_EvidenceTag_Tag_TagsTagId";
       public          postgres    false    3271    229    222            �           2606    28092 4   Evidence FK_Evidence_EvidenceSource_EvidenceSourceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Evidence"
    ADD CONSTRAINT "FK_Evidence_EvidenceSource_EvidenceSourceId" FOREIGN KEY ("EvidenceSourceId") REFERENCES public."EvidenceSource"("EvidenceSourceId") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."Evidence" DROP CONSTRAINT "FK_Evidence_EvidenceSource_EvidenceSourceId";
       public          postgres    false    219    216    3253            �           2606    28097 '   Evidence FK_Evidence_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Evidence"
    ADD CONSTRAINT "FK_Evidence_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Evidence" DROP CONSTRAINT "FK_Evidence_User_CreatorUserId";
       public          postgres    false    3255    217    219                       2606    28274 N   FaceRecognitionDataTimeSeriesTag FK_FaceRecognitionDataTimeSeriesTag_Tag_TagId    FK CONSTRAINT     �   ALTER TABLE ONLY public."FaceRecognitionDataTimeSeriesTag"
    ADD CONSTRAINT "FK_FaceRecognitionDataTimeSeriesTag_Tag_TagId" FOREIGN KEY ("TagId") REFERENCES public."Tag"("TagId") ON DELETE CASCADE;
 |   ALTER TABLE ONLY public."FaceRecognitionDataTimeSeriesTag" DROP CONSTRAINT "FK_FaceRecognitionDataTimeSeriesTag_Tag_TagId";
       public          postgres    false    3271    230    222                       2606    28286 2   MissionTag FK_MissionTag_Mission_MissionsMissionId    FK CONSTRAINT     �   ALTER TABLE ONLY public."MissionTag"
    ADD CONSTRAINT "FK_MissionTag_Mission_MissionsMissionId" FOREIGN KEY ("MissionsMissionId") REFERENCES public."Mission"("MissionId") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."MissionTag" DROP CONSTRAINT "FK_MissionTag_Mission_MissionsMissionId";
       public          postgres    false    220    231    3265                       2606    28291 &   MissionTag FK_MissionTag_Tag_TagsTagId    FK CONSTRAINT     �   ALTER TABLE ONLY public."MissionTag"
    ADD CONSTRAINT "FK_MissionTag_Tag_TagsTagId" FOREIGN KEY ("TagsTagId") REFERENCES public."Tag"("TagId") ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."MissionTag" DROP CONSTRAINT "FK_MissionTag_Tag_TagsTagId";
       public          postgres    false    231    3271    222            �           2606    28109 %   Mission FK_Mission_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Mission"
    ADD CONSTRAINT "FK_Mission_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 S   ALTER TABLE ONLY public."Mission" DROP CONSTRAINT "FK_Mission_User_CreatorUserId";
       public          postgres    false    220    3255    217                       2606    28303 N   PeopleAttributeDataTimeSeriesTag FK_PeopleAttributeDataTimeSeriesTag_Tag_TagId    FK CONSTRAINT     �   ALTER TABLE ONLY public."PeopleAttributeDataTimeSeriesTag"
    ADD CONSTRAINT "FK_PeopleAttributeDataTimeSeriesTag_Tag_TagId" FOREIGN KEY ("TagId") REFERENCES public."Tag"("TagId") ON DELETE CASCADE;
 |   ALTER TABLE ONLY public."PeopleAttributeDataTimeSeriesTag" DROP CONSTRAINT "FK_PeopleAttributeDataTimeSeriesTag_Tag_TagId";
       public          postgres    false    222    3271    232            �           2606    28121 #   Person FK_Person_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "FK_Person_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public."Person" DROP CONSTRAINT "FK_Person_User_CreatorUserId";
       public          postgres    false    217    221    3255                       2606    28315 ]   RelationCaseEvidenceAnalytics FK_RelationCaseEvidenceAnalytics_RelationCaseEvidences_Relatio~    FK CONSTRAINT     �   ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics"
    ADD CONSTRAINT "FK_RelationCaseEvidenceAnalytics_RelationCaseEvidences_Relatio~" FOREIGN KEY ("RelationCaseEvidenceId") REFERENCES public."RelationCaseEvidences"("Id") ON DELETE CASCADE;
 �   ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics" DROP CONSTRAINT "FK_RelationCaseEvidenceAnalytics_RelationCaseEvidences_Relatio~";
       public          postgres    false    226    3289    233            	           2606    28320 Q   RelationCaseEvidenceAnalytics FK_RelationCaseEvidenceAnalytics_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics"
    ADD CONSTRAINT "FK_RelationCaseEvidenceAnalytics_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
    ALTER TABLE ONLY public."RelationCaseEvidenceAnalytics" DROP CONSTRAINT "FK_RelationCaseEvidenceAnalytics_User_CreatorUserId";
       public          postgres    false    217    3255    233            �           2606    28206 :   RelationCaseEvidences FK_RelationCaseEvidences_Case_CaseId    FK CONSTRAINT     �   ALTER TABLE ONLY public."RelationCaseEvidences"
    ADD CONSTRAINT "FK_RelationCaseEvidences_Case_CaseId" FOREIGN KEY ("CaseId") REFERENCES public."Case"("CaseId") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."RelationCaseEvidences" DROP CONSTRAINT "FK_RelationCaseEvidences_Case_CaseId";
       public          postgres    false    218    226    3258            �           2606    28211 B   RelationCaseEvidences FK_RelationCaseEvidences_Evidence_EvidenceId    FK CONSTRAINT     �   ALTER TABLE ONLY public."RelationCaseEvidences"
    ADD CONSTRAINT "FK_RelationCaseEvidences_Evidence_EvidenceId" FOREIGN KEY ("EvidenceId") REFERENCES public."Evidence"("EvidenceId") ON DELETE CASCADE;
 p   ALTER TABLE ONLY public."RelationCaseEvidences" DROP CONSTRAINT "FK_RelationCaseEvidences_Evidence_EvidenceId";
       public          postgres    false    219    3262    226            �           2606    28133    Tag FK_Tag_User_CreatorUserId    FK CONSTRAINT     �   ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "FK_Tag_User_CreatorUserId" FOREIGN KEY ("CreatorUserId") REFERENCES public."User"("UserId") ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Tag" DROP CONSTRAINT "FK_Tag_User_CreatorUserId";
       public          postgres    false    217    3255    222            �   �  x�uU�rG}f�b�Ss�<�a�(A�BȉSy��q� Hr�|}zW�\T��C��s�HX�+�{F;!zф�)�G���}��-�J�qG�t6Y)"�,3��C�H^�H��^�'����	��2]�����<�g�KR��?�����n2i�_�����C�><��w������)��>S�{y~��FYJ��x+����@&:MAő���}����؏���\b�M��� �(_���Y��� T^[j)e�x�䇻I?���{���S�u�v��-0&�r�u�\!y!E�U�`1��	�x:̫��3�gSI��@*C�$���#��|����Nr�s1C�ڂ�D�D(�(2&M&����_�LF3��¡�{�l�r.bQEB0� �l� �518�������+�ɲI�'0	��df���n������n��'�n��/�Q;l�iw{��Y��Q12���G�%��0�(QH����n�Ӆ��i�ו_�-��ءb��.�q�BH9�D��,71�g�����|v�Qެ��e��Y7^Q�YPUs�Հd��"�Q�6�˻������~E�A���k�|p��b$�&S@����-�����+��-o��>���+y4��~�S?D6�꫺>��|�?����i���0%����Se ��'�I�"C��_�&[��6���\#>�� ��RdX8�nusk�h�\[�5��TrU)s�T���]QU���|:����r�8�ʛ�
�f��Ͷɵᕇ$4��q�Uޗ��iWk���t?B�n��ȯ.(֥&g3�Z�#<U���/Z�D\�2I�c,��C��(�J�fC��u���&8RɁ1�B
�X ��_E����=�m��^ZVD+���ߒ!>^a-���cU>�nO�q����x.Łb���·��zH �6l@����otL�ֱ�
l�B��?F@&.�>y���|O����� �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x��1�0 ��|��qb�����b'F,P���{��tw��gt�ȅ�"H{d����e�\���R��5U`B�Z@�IG?L��3�Oj�Z�̃�"C�(���cR�Ӷ�#u֪:f�6�}�2P/F�G�����n��b��,��)�?*�1�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �  x�}�;o[1�g�Wd/lP|�b���^�%A�^�ba�n�fH�}e�s %��k�q������`��:�n�Ԝv�����.�������^�_�������.��НZu�6�C)���,��4�i��tՠC�u�*�h�\5��TF+���
@(ݒB�}�'P�^E{���a��&��M06���g�©	��&J$#B���t�8�i�wY���e���#�ydڞ\����c�� �{���pS	���j��XS�(RRÎ\�5���5u����n����I^h���s�h2�^��Vaq�8���-�F��SiǁE�*����N'ZN��)K�YC>�峬��-o1��u��5ⶄm�КE�N9+��h6��3	��3��v�y����� �H�H�8Ѧ�_@w��{�~}۞�����4+/oO߶{��Ƨ���q���zE�      �   1   x�32021052702276�w.JM,I���,�L��4�3�34����� �\
"     