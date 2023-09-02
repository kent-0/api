import { Migration } from '@mikro-orm/migrations';

export class Migration20230902224302 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "projects_notes" add column "created_by_id" uuid not null;');
    this.addSql('comment on column "projects_notes"."created_by_id" is \'Author of the note.\';');
    this.addSql('alter table "projects_notes" add constraint "projects_notes_created_by_id_foreign" foreign key ("created_by_id") references "auth_users" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "projects_notes" drop constraint "projects_notes_created_by_id_foreign";');

    this.addSql('alter table "projects_notes" drop column "created_by_id";');
  }

}
