CREATE TABLE IF NOT EXISTS "area" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"household_id" text,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "areas_to_chores" (
	"area_id" text,
	"chore_id" text,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	CONSTRAINT areas_to_chores_area_id_chore_id PRIMARY KEY("area_id","chore_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chore" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"household_id" text,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "household" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"cuid" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"expires_at" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"household_id" text,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_chores" (
	"user_id" text NOT NULL,
	"chore_id" text NOT NULL,
	"created_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	"updated_at" text DEFAULT '2023-08-16T05:50:33.389Z',
	CONSTRAINT users_to_chores_user_id_chore_id PRIMARY KEY("user_id","chore_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "area" ADD CONSTRAINT "area_household_id_household_cuid_fk" FOREIGN KEY ("household_id") REFERENCES "household"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "areas_to_chores" ADD CONSTRAINT "areas_to_chores_area_id_area_cuid_fk" FOREIGN KEY ("area_id") REFERENCES "area"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "areas_to_chores" ADD CONSTRAINT "areas_to_chores_chore_id_chore_cuid_fk" FOREIGN KEY ("chore_id") REFERENCES "chore"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chore" ADD CONSTRAINT "chore_household_id_household_cuid_fk" FOREIGN KEY ("household_id") REFERENCES "household"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_cuid_fk" FOREIGN KEY ("user_id") REFERENCES "user"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_household_id_household_cuid_fk" FOREIGN KEY ("household_id") REFERENCES "household"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_chores" ADD CONSTRAINT "users_to_chores_user_id_user_cuid_fk" FOREIGN KEY ("user_id") REFERENCES "user"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_chores" ADD CONSTRAINT "users_to_chores_chore_id_chore_cuid_fk" FOREIGN KEY ("chore_id") REFERENCES "chore"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
