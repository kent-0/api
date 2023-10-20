import { Migration } from '@mikro-orm/migrations';

export class Migration20231020190701 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_parent_id_foreign";');

    this.addSql('alter table "boards_steps" add column "type" smallint not null;');
    this.addSql('comment on column "boards_steps"."type" is \'If the step is the first or last step in the board.\';');
    this.addSql('alter table "boards_steps" drop column "finish_step";');

    this.addSql('alter table "boards_tasks" alter column "parent_id" drop default;');
    this.addSql('alter table "boards_tasks" alter column "parent_id" type uuid using ("parent_id"::text::uuid);');
    this.addSql('alter table "boards_tasks" alter column "parent_id" drop not null;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_parent_id_foreign" foreign key ("parent_id") references "boards_tasks" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_parent_id_foreign";');

    this.addSql('alter table "boards_steps" add column "finish_step" bool not null default false;');
    this.addSql('comment on column "boards_steps"."finish_step" is \'Flag if this step is the final completion step of the step flow.\';');
    this.addSql('alter table "boards_steps" drop column "type";');

    this.addSql('alter table "boards_tasks" alter column "parent_id" drop default;');
    this.addSql('alter table "boards_tasks" alter column "parent_id" type uuid using ("parent_id"::text::uuid);');
    this.addSql('alter table "boards_tasks" alter column "parent_id" set not null;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_parent_id_foreign" foreign key ("parent_id") references "boards_tasks" ("id") on update cascade;');
  }

}
