import { Migration } from '@mikro-orm/migrations';

export class Migration20230831170510 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_users" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "email" varchar not null, "first_name" varchar not null, "last_name" varchar not null, "password_id" uuid null, "username" varchar not null, constraint "auth_users_pkey" primary key ("id"), constraint auth_users_email_check check (email ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\'), constraint auth_users_username_check check (username ~ \'^[A-Za-z0-9_-]+$\'));');
    this.addSql('comment on table "auth_users" is \'Information about all users on the platform.\';');
    this.addSql('comment on column "auth_users"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_users"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_users"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_users"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_users"."email" is \'Unique email per user.\';');
    this.addSql('comment on column "auth_users"."first_name" is \'First name of the user\';');
    this.addSql('comment on column "auth_users"."last_name" is \'Last name of the user\';');
    this.addSql('comment on column "auth_users"."password_id" is \'Relationship to the user assigned to the created password.\';');
    this.addSql('comment on column "auth_users"."username" is \'Unique user name per user.\';');
    this.addSql('alter table "auth_users" add constraint "auth_users_email_unique" unique ("email");');
    this.addSql('alter table "auth_users" add constraint "auth_users_password_id_unique" unique ("password_id");');
    this.addSql('alter table "auth_users" add constraint "auth_users_username_unique" unique ("username");');

    this.addSql('create table "auth_tokens" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "device" varchar not null, "expiration" timestamp not null, "revoked" bool not null default false, "token_type" text check ("token_type" in (\'auth\', \'refresh\')) not null, "token_value" varchar not null, "user_id" uuid not null, constraint "auth_tokens_pkey" primary key ("id"));');
    this.addSql('comment on table "auth_tokens" is \'Access and refresh tokens created in user sessions.\';');
    this.addSql('comment on column "auth_tokens"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_tokens"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_tokens"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_tokens"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_tokens"."device" is \'Name of the device used to generate the token.\';');
    this.addSql('comment on column "auth_tokens"."expiration" is \'Token expiration date.\';');
    this.addSql('comment on column "auth_tokens"."revoked" is \'Token revocation status.\';');
    this.addSql('comment on column "auth_tokens"."token_type" is \'Type of token generated.\';');
    this.addSql('comment on column "auth_tokens"."user_id" is \'Relationship to the user assigned to the generated token.\';');
    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_token_value_unique" unique ("token_value");');

    this.addSql('create table "auth_passwords" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "password_hash" varchar not null, "salt" varchar not null, "user_id" uuid not null, constraint "auth_passwords_pkey" primary key ("id"));');
    this.addSql('comment on table "auth_passwords" is \'Passwords assigned to user accounts.\';');
    this.addSql('comment on column "auth_passwords"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_passwords"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_passwords"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_passwords"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_passwords"."password_hash" is \'Hash resulting from the password combined with the "salt".\';');
    this.addSql('comment on column "auth_passwords"."salt" is \'Salt used during the hashing process.\';');
    this.addSql('comment on column "auth_passwords"."user_id" is \'Relationship to the user assigned to the created password.\';');
    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_password_hash_unique" unique ("password_hash");');
    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_user_id_unique" unique ("user_id");');

    this.addSql('alter table "auth_users" add constraint "auth_users_password_id_foreign" foreign key ("password_id") references "auth_passwords" ("id") on update cascade on delete set null;');

    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade;');

    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete cascade;');
  }

}
