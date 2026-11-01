CREATE TYPE "public"."exercise_mechanics" AS ENUM('compound', 'isolation');--> statement-breakpoint
CREATE TYPE "public"."exercise_muscle_role" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."grip_orientation" AS ENUM('overhand', 'underhand', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."grip_width" AS ENUM('close', 'standard', 'wide');--> statement-breakpoint
CREATE TYPE "public"."modifier_value_kind" AS ENUM('weight', 'duration', 'none');--> statement-breakpoint
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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"equipment_id" uuid NOT NULL,
	"grip_orientation" "grip_orientation",
	"grip_width" "grip_width",
	"is_unilateral" boolean DEFAULT false NOT NULL,
	"mechanics" "exercise_mechanics",
	CONSTRAINT "exercise_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_attachment_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "exercise_equipment_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_movement_pattern" (
	"exercise_id" uuid NOT NULL,
	"movement_pattern_id" integer NOT NULL,
	CONSTRAINT "exercise_movement_pattern_exercise_id_movement_pattern_id_pk" PRIMARY KEY("exercise_id","movement_pattern_id")
);
--> statement-breakpoint
CREATE TABLE "exercise_muscle" (
	"exercise_id" uuid NOT NULL,
	"muscle_id" integer NOT NULL,
	"role" "exercise_muscle_role" NOT NULL,
	CONSTRAINT "exercise_muscle_exercise_id_muscle_id_pk" PRIMARY KEY("exercise_id","muscle_id")
);
--> statement-breakpoint
CREATE TABLE "movement_pattern" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movement_pattern_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "movement_pattern_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "muscle" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "muscle_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "muscle_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "modifier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"value_kind" "modifier_value_kind" NOT NULL,
	CONSTRAINT "modifier_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_equipment_id_exercise_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."exercise_equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_movement_pattern" ADD CONSTRAINT "exercise_movement_pattern_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_movement_pattern" ADD CONSTRAINT "exercise_movement_pattern_movement_pattern_id_movement_pattern_id_fk" FOREIGN KEY ("movement_pattern_id") REFERENCES "public"."movement_pattern"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscle" ADD CONSTRAINT "exercise_muscle_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscle" ADD CONSTRAINT "exercise_muscle_muscle_id_muscle_id_fk" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");