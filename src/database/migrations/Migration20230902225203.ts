import { Migration } from '@mikro-orm/migrations';

export class Migration20230902225203 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards" add column "project_id" uuid not null;');
    this.addSql('comment on column "boards"."project_id" is \'Project owner of the board.\';');
    this.addSql('alter table "boards" add constraint "boards_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards" drop constraint "boards_project_id_foreign";');

    this.addSql('alter table "boards" drop column "project_id";');
  }

}
