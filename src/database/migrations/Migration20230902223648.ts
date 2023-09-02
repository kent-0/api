import { Migration } from '@mikro-orm/migrations';

export class Migration20230902223648 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "projects" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "description" varchar(300) not null, "end_date" timestamp null, "name" varchar(50) not null, "owner_id" uuid not null, "start_date" timestamp not null, "status" smallint not null default 3, constraint "projects_pkey" primary key ("id"));');
    this.addSql('comment on table "projects" is \'Projects to manage and group boards.\';');
    this.addSql('comment on column "projects"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "projects"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "projects"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "projects"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "projects"."description" is \'Brief description of what the project is about.\';');
    this.addSql('comment on column "projects"."end_date" is \'Expected completion date for the project.\';');
    this.addSql('comment on column "projects"."name" is \'Project\'\'s name.\';');
    this.addSql('comment on column "projects"."owner_id" is \'Project owner user. If the owner deletes his account, the projects will also be affected.\';');
    this.addSql('comment on column "projects"."start_date" is \'Project start date. By default it is not set until the project is marked as in progress.\';');
    this.addSql('comment on column "projects"."status" is \'Current status of the project.\';');

    this.addSql('create table "projects_goals" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "description" varchar not null, "name" varchar not null, "project_id" uuid not null, "status" smallint not null default 3, constraint "projects_goals_pkey" primary key ("id"));');
    this.addSql('comment on table "projects_goals" is \'Goals to be achieved in the project.\';');
    this.addSql('comment on column "projects_goals"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "projects_goals"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "projects_goals"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "projects_goals"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "projects_goals"."description" is \'Brief description of the goal to achieve.\';');
    this.addSql('comment on column "projects_goals"."name" is \'Name of the goal to achieve.\';');
    this.addSql('comment on column "projects_goals"."project_id" is \'Project assigned to the goal.\';');
    this.addSql('comment on column "projects_goals"."status" is \'Current status of the goal.\';');

    this.addSql('create table "projects_members" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "project_id" uuid not null, "user_id" uuid not null, constraint "projects_members_pkey" primary key ("id"));');
    this.addSql('comment on table "projects_members" is \'Users invited to projects.\';');
    this.addSql('comment on column "projects_members"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "projects_members"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "projects_members"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "projects_members"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "projects_members"."project_id" is \'Board to which the user is a member.\';');
    this.addSql('comment on column "projects_members"."user_id" is \'User member of the board.\';');

    this.addSql('create table "projects_roles" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "name" varchar not null, "permissions" numeric not null, "project_id" uuid not null, constraint "projects_roles_pkey" primary key ("id"));');
    this.addSql('comment on table "projects_roles" is \'Roles to manage the projects. Role permissions use the bit-based permission system.\';');
    this.addSql('comment on column "projects_roles"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "projects_roles"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "projects_roles"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "projects_roles"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "projects_roles"."name" is \'Name representing the role.\';');
    this.addSql('comment on column "projects_roles"."permissions" is \'Role bit-based permissions\';');
    this.addSql('comment on column "projects_roles"."project_id" is \'Project assigned to the role. When the board is removed, its available roles are also removed.\';');

    this.addSql('create table "projects_members_roles" ("project_members_entity_id" uuid not null, "project_roles_entity_id" uuid not null, constraint "projects_members_roles_pkey" primary key ("project_members_entity_id", "project_roles_entity_id"));');

    this.addSql('alter table "projects" add constraint "projects_owner_id_foreign" foreign key ("owner_id") references "auth_users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "projects_goals" add constraint "projects_goals_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "projects_members" add constraint "projects_members_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "projects_members" add constraint "projects_members_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "projects_roles" add constraint "projects_roles_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_project_members_entity_id_foreign" foreign key ("project_members_entity_id") references "projects_members" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_project_roles_entity_id_foreign" foreign key ("project_roles_entity_id") references "projects_roles" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "projects_goals" drop constraint "projects_goals_project_id_foreign";');

    this.addSql('alter table "projects_members" drop constraint "projects_members_project_id_foreign";');

    this.addSql('alter table "projects_roles" drop constraint "projects_roles_project_id_foreign";');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_project_members_entity_id_foreign";');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_project_roles_entity_id_foreign";');

    this.addSql('drop table if exists "projects" cascade;');

    this.addSql('drop table if exists "projects_goals" cascade;');

    this.addSql('drop table if exists "projects_members" cascade;');

    this.addSql('drop table if exists "projects_roles" cascade;');

    this.addSql('drop table if exists "projects_members_roles" cascade;');
  }

}
