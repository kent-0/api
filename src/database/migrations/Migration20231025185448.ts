import { Migration } from '@mikro-orm/migrations';

export class Migration20231025185448 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks_comments" drop constraint "boards_tasks_comments_task_id_foreign";');

    this.addSql('alter table "boards_tags" add column "board_id" uuid not null;');
    this.addSql('comment on column "boards_tags"."board_id" is \'Board on which tasks are assigned.\';');
    this.addSql('alter table "boards_tags" add constraint "boards_tags_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade;');

    this.addSql('alter table "boards_tasks_comments" add column "content" varchar(1000) not null;');
    this.addSql('alter table "boards_tasks_comments" alter column "task_id" drop default;');
    this.addSql('alter table "boards_tasks_comments" alter column "task_id" type uuid using ("task_id"::text::uuid);');
    this.addSql('alter table "boards_tasks_comments" alter column "task_id" drop not null;');
    this.addSql('comment on column "boards_tasks_comments"."content" is \'Content of the comment.\';');
    this.addSql('alter table "boards_tasks_comments" add constraint "boards_tasks_comments_task_id_foreign" foreign key ("task_id") references "boards_tasks" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tags" drop constraint "boards_tags_board_id_foreign";');

    this.addSql('alter table "boards_tasks_comments" drop constraint "boards_tasks_comments_task_id_foreign";');

    this.addSql('alter table "boards_tags" drop column "board_id";');

    this.addSql('alter table "boards_tasks_comments" alter column "task_id" drop default;');
    this.addSql('alter table "boards_tasks_comments" alter column "task_id" type uuid using ("task_id"::text::uuid);');
    this.addSql('alter table "boards_tasks_comments" alter column "task_id" set not null;');
    this.addSql('alter table "boards_tasks_comments" drop column "content";');
    this.addSql('alter table "boards_tasks_comments" add constraint "boards_tasks_comments_task_id_foreign" foreign key ("task_id") references "boards_tasks" ("id") on update cascade;');
  }

}
