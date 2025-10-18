CREATE TYPE "public"."post_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TABLE "solutions" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"model_name" text NOT NULL,
	"media_content" text[],
	"author_id" text NOT NULL,
	"post_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "content" TO "description";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "type" "post_type" DEFAULT 'image';--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "images" text[];--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;