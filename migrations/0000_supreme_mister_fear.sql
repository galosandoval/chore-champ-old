CREATE TABLE IF NOT EXISTS "chore" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"household_id" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "household" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"household_id" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_chores" (
	"user_id" text NOT NULL,
	"chore_id" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT users_to_chores_user_id_chore_id PRIMARY KEY("user_id","chore_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chore" ADD CONSTRAINT "chore_household_id_household_cuid_fk" FOREIGN KEY ("household_id") REFERENCES "household"("cuid") ON DELETE no action ON UPDATE no action;
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
