import { Migration } from '@mikro-orm/migrations';

export class Migration20230903141121 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "activity_history" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "board_id" uuid null, "member_id" uuid not null, "project_id" uuid not null, "reference_id" uuid not null, "type" smallint not null, constraint "activity_history_pkey" primary key ("id"));');
    this.addSql('comment on table "activity_history" is \'Activity log to audit changes to dashboards and projects.\';');
    this.addSql('comment on column "activity_history"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "activity_history"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "activity_history"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "activity_history"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "activity_history"."board_id" is \'Board where the activity originated.\';');
    this.addSql('comment on column "activity_history"."member_id" is \'Member who performed the action.\';');
    this.addSql('comment on column "activity_history"."project_id" is \'Project where the activity originated.\';');
    this.addSql('comment on column "activity_history"."reference_id" is \'Reference ID of the managed element.\';');
    this.addSql('comment on column "activity_history"."type" is \'Type of action performed in the activity.\';');

    this.addSql('alter table "activity_history" add constraint "activity_history_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete set null;');
    this.addSql('alter table "activity_history" add constraint "activity_history_member_id_foreign" foreign key ("member_id") references "auth_users" ("id") on update cascade;');
    this.addSql('alter table "activity_history" add constraint "activity_history_project_id_foreign" foreign key ("project_id") references "boards" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "activity_history" cascade;');
  }

}
