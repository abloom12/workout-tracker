CREATE TYPE "public"."load_convention" AS ENUM('total_weight', 'per_implement', 'per_side', 'added_to_bodyweight', 'assisted');--> statement-breakpoint
CREATE TYPE "public"."set_side" AS ENUM('both', 'left', 'right');--> statement-breakpoint
CREATE TYPE "public"."modifier_value_kind" AS ENUM('weight', 'duration', 'none');--> statement-breakpoint
CREATE TYPE "public"."set_type" AS ENUM('warmup', 'working');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_code_unique" UNIQUE("code"),
	CONSTRAINT "exercise_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_attachment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_attachment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_attachment_code_unique" UNIQUE("code"),
	CONSTRAINT "exercise_attachment_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_equipment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_equipment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_equipment_code_unique" UNIQUE("code"),
	CONSTRAINT "exercise_equipment_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_grip" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_grip_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_grip_code_unique" UNIQUE("code"),
	CONSTRAINT "exercise_grip_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_setup" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exercise_setup_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	"exercise_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	"grip_id" integer NOT NULL,
	"attachment_id" integer,
	"load_convention" "load_convention" NOT NULL,
	"is_unilateral" boolean DEFAULT false NOT NULL,
	CONSTRAINT "exercise_setup_code_unique" UNIQUE("code"),
	CONSTRAINT "exercise_setup_components_unique" UNIQUE NULLS NOT DISTINCT("exercise_id","equipment_id","grip_id","is_unilateral","attachment_id")
);
--> statement-breakpoint
CREATE TABLE "session_exercise" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"workout_session_id" uuid NOT NULL,
	"exercise_setup_id" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "session_exercise_position_unique" UNIQUE("workout_session_id","position"),
	CONSTRAINT "session_exercise_position_nonnegative" CHECK ("session_exercise"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "workout_session" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"planned_workout" jsonb NOT NULL,
	CONSTRAINT "workout_session_completion_valid" CHECK ("workout_session"."completed_at" IS NULL OR "workout_session"."completed_at" >= "workout_session"."started_at"),
	CONSTRAINT "workout_session_snapshot_object" CHECK (jsonb_typeof("workout_session"."planned_workout") = 'object'),
	CONSTRAINT "workout_session_snapshot_version" CHECK (("workout_session"."planned_workout" -> 'schema_version' = '1'::jsonb) IS TRUE)
);
--> statement-breakpoint
CREATE TABLE "workout_set" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"session_exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"side" "set_side" DEFAULT 'both' NOT NULL,
	"weight_lb" numeric,
	"reps" integer,
	"duration_seconds" numeric,
	"set_type" "set_type" DEFAULT 'working' NOT NULL,
	CONSTRAINT "workout_set_number_side_unique" UNIQUE("session_exercise_id","set_number","side"),
	CONSTRAINT "workout_set_number_positive" CHECK ("workout_set"."set_number" >= 1),
	CONSTRAINT "workout_set_weight_nonnegative" CHECK ("workout_set"."weight_lb" IS NULL OR "workout_set"."weight_lb" >= 0),
	CONSTRAINT "workout_set_reps_nonnegative" CHECK ("workout_set"."reps" IS NULL OR "workout_set"."reps" >= 0),
	CONSTRAINT "workout_set_duration_positive" CHECK ("workout_set"."duration_seconds" IS NULL OR "workout_set"."duration_seconds" > 0),
	CONSTRAINT "workout_set_has_performance" CHECK ("workout_set"."reps" IS NOT NULL OR "workout_set"."duration_seconds" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "workout_set_modifier" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"workout_set_id" uuid NOT NULL,
	"modifier_id" integer NOT NULL,
	"weight_lb" numeric,
	"duration_seconds" numeric,
	CONSTRAINT "workout_set_modifier_unique" UNIQUE("workout_set_id","modifier_id"),
	CONSTRAINT "workout_set_modifier_weight_nonnegative" CHECK ("workout_set_modifier"."weight_lb" IS NULL OR "workout_set_modifier"."weight_lb" >= 0),
	CONSTRAINT "workout_set_modifier_duration_positive" CHECK ("workout_set_modifier"."duration_seconds" IS NULL OR "workout_set_modifier"."duration_seconds" > 0),
	CONSTRAINT "workout_set_modifier_single_value" CHECK ("workout_set_modifier"."weight_lb" IS NULL OR "workout_set_modifier"."duration_seconds" IS NULL)
);
--> statement-breakpoint
CREATE TABLE "modifier" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "modifier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	"value_kind" "modifier_value_kind" NOT NULL,
	CONSTRAINT "modifier_code_unique" UNIQUE("code"),
	CONSTRAINT "modifier_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "training_split" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_split_workout" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"split_id" uuid NOT NULL,
	"workout_id" uuid NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "training_split_workout_position_unique" UNIQUE("split_id","position"),
	CONSTRAINT "training_split_workout_position_nonnegative" CHECK ("training_split_workout"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "planned_set" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"workout_exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"reps_min" integer,
	"reps_max" integer,
	"is_amrap" boolean DEFAULT false NOT NULL,
	"target_weight_lb" numeric,
	"duration_seconds" numeric,
	"set_type" "set_type" DEFAULT 'working' NOT NULL,
	CONSTRAINT "planned_set_number_unique" UNIQUE("workout_exercise_id","set_number"),
	CONSTRAINT "planned_set_number_positive" CHECK ("planned_set"."set_number" >= 1),
	CONSTRAINT "planned_set_weight_nonnegative" CHECK ("planned_set"."target_weight_lb" IS NULL OR "planned_set"."target_weight_lb" >= 0),
	CONSTRAINT "planned_set_reps_min_positive" CHECK ("planned_set"."reps_min" IS NULL OR "planned_set"."reps_min" >= 1),
	CONSTRAINT "planned_set_reps_max_valid" CHECK ("planned_set"."reps_max" IS NULL OR ("planned_set"."reps_min" IS NOT NULL AND "planned_set"."reps_max" >= "planned_set"."reps_min")),
	CONSTRAINT "planned_set_amrap_no_bounds" CHECK (NOT "planned_set"."is_amrap" OR ("planned_set"."reps_min" IS NULL AND "planned_set"."reps_max" IS NULL)),
	CONSTRAINT "planned_set_duration_positive" CHECK ("planned_set"."duration_seconds" IS NULL OR "planned_set"."duration_seconds" > 0),
	CONSTRAINT "planned_set_has_prescription" CHECK ("planned_set"."reps_min" IS NOT NULL OR "planned_set"."is_amrap" OR "planned_set"."duration_seconds" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "planned_set_modifier" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"planned_set_id" uuid NOT NULL,
	"modifier_id" integer NOT NULL,
	"weight_lb" numeric,
	"duration_seconds" numeric,
	CONSTRAINT "planned_set_modifier_unique" UNIQUE("planned_set_id","modifier_id"),
	CONSTRAINT "planned_set_modifier_weight_nonnegative" CHECK ("planned_set_modifier"."weight_lb" IS NULL OR "planned_set_modifier"."weight_lb" >= 0),
	CONSTRAINT "planned_set_modifier_duration_positive" CHECK ("planned_set_modifier"."duration_seconds" IS NULL OR "planned_set_modifier"."duration_seconds" > 0),
	CONSTRAINT "planned_set_modifier_single_value" CHECK ("planned_set_modifier"."weight_lb" IS NULL OR "planned_set_modifier"."duration_seconds" IS NULL)
);
--> statement-breakpoint
CREATE TABLE "workout" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercise" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"exercise_setup_id" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "workout_exercise_position_unique" UNIQUE("workout_id","position"),
	CONSTRAINT "workout_exercise_position_positive" CHECK ("workout_exercise"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_setup" ADD CONSTRAINT "exercise_setup_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_setup" ADD CONSTRAINT "exercise_setup_equipment_id_exercise_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."exercise_equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_setup" ADD CONSTRAINT "exercise_setup_grip_id_exercise_grip_id_fk" FOREIGN KEY ("grip_id") REFERENCES "public"."exercise_grip"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_setup" ADD CONSTRAINT "exercise_setup_attachment_id_exercise_attachment_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."exercise_attachment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercise" ADD CONSTRAINT "session_exercise_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercise" ADD CONSTRAINT "session_exercise_exercise_setup_id_exercise_setup_id_fk" FOREIGN KEY ("exercise_setup_id") REFERENCES "public"."exercise_setup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_set" ADD CONSTRAINT "workout_set_session_exercise_id_session_exercise_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_set_modifier" ADD CONSTRAINT "workout_set_modifier_workout_set_id_workout_set_id_fk" FOREIGN KEY ("workout_set_id") REFERENCES "public"."workout_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_set_modifier" ADD CONSTRAINT "workout_set_modifier_modifier_id_modifier_id_fk" FOREIGN KEY ("modifier_id") REFERENCES "public"."modifier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_split" ADD CONSTRAINT "training_split_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_split_workout" ADD CONSTRAINT "training_split_workout_split_id_training_split_id_fk" FOREIGN KEY ("split_id") REFERENCES "public"."training_split"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_split_workout" ADD CONSTRAINT "training_split_workout_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_set" ADD CONSTRAINT "planned_set_workout_exercise_id_workout_exercise_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_set_modifier" ADD CONSTRAINT "planned_set_modifier_planned_set_id_planned_set_id_fk" FOREIGN KEY ("planned_set_id") REFERENCES "public"."planned_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_set_modifier" ADD CONSTRAINT "planned_set_modifier_modifier_id_modifier_id_fk" FOREIGN KEY ("modifier_id") REFERENCES "public"."modifier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_setup_id_exercise_setup_id_fk" FOREIGN KEY ("exercise_setup_id") REFERENCES "public"."exercise_setup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "session_exercise_setup_idx" ON "session_exercise" USING btree ("exercise_setup_id");--> statement-breakpoint
CREATE INDEX "workout_session_owner_started_at_idx" ON "workout_session" USING btree ("owner_id","started_at");