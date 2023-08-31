import { Migration } from '@mikro-orm/migrations';

export class Migration20230831181422 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "boards" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "created_by_id" uuid not null, "name" varchar not null, constraint "boards_pkey" primary key ("id"));');
    this.addSql('comment on table "boards" is \'Task table information.\';');
    this.addSql('comment on column "boards"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "boards"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "boards"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "boards"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "boards"."created_by_id" is \'Creator of the board. When the user is deleted, the associated dashboard is also deleted.\';');
    this.addSql('comment on column "boards"."name" is \'Name of the board.\';');

    this.addSql('create table "board_roles" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "board_id" uuid not null, "name" varchar not null, "permissions" numeric not null, constraint "board_roles_pkey" primary key ("id"));');
    this.addSql('comment on table "board_roles" is \'Roles to manage the boards. Role permissions use the bit-based permission system.\';');
    this.addSql('comment on column "board_roles"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "board_roles"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "board_roles"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "board_roles"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "board_roles"."board_id" is \'Board assigned to the role. When the board is removed, its available roles are also removed.\';');
    this.addSql('comment on column "board_roles"."name" is \'Name representing the role.\';');
    this.addSql('comment on column "board_roles"."permissions" is \'Role bit-based permissions\';');

    this.addSql('alter table "boards" add constraint "boards_created_by_id_foreign" foreign key ("created_by_id") references "auth_users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "board_roles" add constraint "board_roles_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;');

    this.addSql('comment on column "auth_users"."first_name" is \'First name of the user.\';');
    this.addSql('comment on column "auth_users"."last_name" is \'Last name of the user.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "board_roles" drop constraint "board_roles_board_id_foreign";');

    this.addSql('drop table if exists "boards" cascade;');

    this.addSql('drop table if exists "board_roles" cascade;');

    this.addSql('comment on column "auth_users"."first_name" is \'First name of the user\';');
    this.addSql('comment on column "auth_users"."last_name" is \'Last name of the user\';');
  }

}
