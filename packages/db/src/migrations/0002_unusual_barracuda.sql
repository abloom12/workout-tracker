CREATE TABLE "workout_template" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workout_template_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workout_template_name_not_blank" CHECK (length(btrim("workout_template"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "workout_template_exercise" (
	"workout_template_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "workout_template_exercise_pk" PRIMARY KEY("workout_template_id","exercise_id"),
	CONSTRAINT "workout_template_exercise_position_nonnegative" CHECK ("workout_template_exercise"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template_exercise" ADD CONSTRAINT "workout_template_exercise_workout_template_id_workout_template_id_fk" FOREIGN KEY ("workout_template_id") REFERENCES "public"."workout_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template_exercise" ADD CONSTRAINT "workout_template_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workout_template_owner_name_unique" ON "workout_template" USING btree ("owner_id",lower(btrim("name")));--> statement-breakpoint
CREATE UNIQUE INDEX "workout_template_exercise_position_unique" ON "workout_template_exercise" USING btree ("workout_template_id","position");--> statement-breakpoint
CREATE INDEX "workout_template_exercise_exercise_id_idx" ON "workout_template_exercise" USING btree ("exercise_id");