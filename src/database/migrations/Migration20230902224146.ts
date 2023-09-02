import { Migration } from '@mikro-orm/migrations';

export class Migration20230902224146 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "projects_notes" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "content" varchar not null, "project_id" uuid not null, "title" varchar not null, constraint "projects_notes_pkey" primary key ("id"));');
    this.addSql('comment on table "projects_notes" is \'Notes related to the project.\';');
    this.addSql('comment on column "projects_notes"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "projects_notes"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "projects_notes"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "projects_notes"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "projects_notes"."content" is \'Content that describes the title of the note.\';');
    this.addSql('comment on column "projects_notes"."project_id" is \'Project assigned to the note.\';');
    this.addSql('comment on column "projects_notes"."title" is \'Title of the note.\';');

    this.addSql('alter table "projects_notes" add constraint "projects_notes_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "projects_notes" cascade;');
  }

}
