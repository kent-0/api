import { Migration } from '@mikro-orm/migrations';

export class Migration20230902233434 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "boards_tasks_comments" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "author_id" uuid not null, "task_id" uuid not null, "type" smallint not null, constraint "boards_tasks_comments_pkey" primary key ("id"));');
    this.addSql('comment on column "boards_tasks_comments"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "boards_tasks_comments"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "boards_tasks_comments"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "boards_tasks_comments"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "boards_tasks_comments"."author_id" is \'Author of the comment.\';');
    this.addSql('comment on column "boards_tasks_comments"."task_id" is \'Task originating from the comment.\';');
    this.addSql('comment on column "boards_tasks_comments"."type" is \'Whether the comment is a general comment or a reply to a comment.\';');

    this.addSql('alter table "boards_tasks_comments" add constraint "boards_tasks_comments_author_id_foreign" foreign key ("author_id") references "auth_users" ("id") on update cascade;');
    this.addSql('alter table "boards_tasks_comments" add constraint "boards_tasks_comments_task_id_foreign" foreign key ("task_id") references "boards_tasks" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "boards_tasks_comments" cascade;');
  }

}
