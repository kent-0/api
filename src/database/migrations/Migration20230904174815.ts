import { Migration } from '@mikro-orm/migrations';

export class Migration20230904174815 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "activity_history" drop constraint "activity_history_project_id_foreign";');

    this.addSql('comment on column "auth_users"."email_id" is \'Relationship to the email assigned to the user.\';');
    this.addSql('comment on column "auth_users"."password_id" is \'Relationship to the password assigned to the user.\';');
    this.addSql('comment on column "auth_users"."username" is \'Unique username per user.\';');

    this.addSql('alter table "projects" alter column "start_date" type timestamp using ("start_date"::timestamp);');
    this.addSql('alter table "projects" alter column "start_date" drop not null;');
    this.addSql('comment on column "projects"."owner_id" is \'Project owner user. If the owner deletes their account, the projects will also be affected.\';');

    this.addSql('comment on column "boards_tasks"."finish_date" is \'Date on which the task ends.\';');

    this.addSql('alter table "activity_history" add constraint "activity_history_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;');

    this.addSql('comment on column "projects_members"."project_id" is \'Project to which the user is a member.\';');
    this.addSql('comment on column "projects_members"."user_id" is \'User member of the project.\';');

    this.addSql('comment on column "projects_roles"."project_id" is \'Project assigned to the role. When the project is removed, its available roles are also removed.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "activity_history" drop constraint "activity_history_project_id_foreign";');

    this.addSql('comment on column "auth_users"."email_id" is \'Relationship to the user assigned to the created email.\';');
    this.addSql('comment on column "auth_users"."password_id" is \'Relationship to the user assigned to the created password.\';');
    this.addSql('comment on column "auth_users"."username" is \'Unique user name per user.\';');

    this.addSql('alter table "projects" alter column "start_date" type timestamp using ("start_date"::timestamp);');
    this.addSql('alter table "projects" alter column "start_date" set not null;');
    this.addSql('comment on column "projects"."owner_id" is \'Project owner user. If the owner deletes his account, the projects will also be affected.\';');

    this.addSql('comment on column "boards_tasks"."finish_date" is \'Date on which the task end.\';');

    this.addSql('alter table "activity_history" add constraint "activity_history_project_id_foreign" foreign key ("project_id") references "boards" ("id") on update cascade;');

    this.addSql('comment on column "projects_members"."project_id" is \'Board to which the user is a member.\';');
    this.addSql('comment on column "projects_members"."user_id" is \'User member of the board.\';');

    this.addSql('comment on column "projects_roles"."project_id" is \'Project assigned to the role. When the board is removed, its available roles are also removed.\';');
  }

}
