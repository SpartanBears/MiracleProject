CREATE TABLE "user" (
	"user_id" serial NOT NULL,
	"login_user" VARCHAR(32) NOT NULL UNIQUE,
	"login_pwd" VARCHAR(128) NOT NULL,
	"username" VARCHAR(32) NOT NULL UNIQUE,
	CONSTRAINT user_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "god" (
	"god_id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"desc" VARCHAR(512),
	CONSTRAINT god_pk PRIMARY KEY ("god_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "familia" (
	"familia_id" serial NOT NULL,
	"god_id" integer NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	CONSTRAINT familia_pk PRIMARY KEY ("familia_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "guild" (
	"guild_id" serial NOT NULL,
	"name" VARCHAR(64) NOT NULL UNIQUE,
	"guild_type_id" integer NOT NULL,
	CONSTRAINT guild_pk PRIMARY KEY ("guild_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "guild_familia" (
	"guild_familia_id" serial NOT NULL,
	"familia_id" integer NOT NULL,
	"guild_id" integer NOT NULL,
	CONSTRAINT guild_familia_pk PRIMARY KEY ("guild_familia_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "adventurer" (
	"adventurer_id" serial NOT NULL,
	"familia_id" integer NOT NULL,
	"json" VARCHAR(1024) NOT NULL UNIQUE,
	CONSTRAINT adventurer_pk PRIMARY KEY ("adventurer_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "guild_type" (
	"guild_type_id" serial NOT NULL,
	"name" VARCHAR(64) NOT NULL UNIQUE,
	CONSTRAINT guild_type_pk PRIMARY KEY ("guild_type_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "god" ADD CONSTRAINT "god_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("user_id");

ALTER TABLE "familia" ADD CONSTRAINT "familia_fk0" FOREIGN KEY ("god_id") REFERENCES "god"("god_id");

ALTER TABLE "guild" ADD CONSTRAINT "guild_fk0" FOREIGN KEY ("guild_type_id") REFERENCES "guild_type"("guild_type_id");

ALTER TABLE "guild_familia" ADD CONSTRAINT "guild_familia_fk0" FOREIGN KEY ("familia_id") REFERENCES "familia"("familia_id");
ALTER TABLE "guild_familia" ADD CONSTRAINT "guild_familia_fk1" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id");

ALTER TABLE "adventurer" ADD CONSTRAINT "adventurer_fk0" FOREIGN KEY ("familia_id") REFERENCES "familia"("familia_id");


