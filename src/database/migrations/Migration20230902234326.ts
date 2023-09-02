import { Migration } from '@mikro-orm/migrations';

export class Migration20230902234326 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "boards_tags" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "created_by_id" uuid not null, "description" varchar null, "name" varchar not null, constraint "boards_tags_pkey" primary key ("id"));');
    this.addSql('comment on table "boards_tags" is \'Tags to assign to tasks.\';');
    this.addSql('comment on column "boards_tags"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "boards_tags"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "boards_tags"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "boards_tags"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "boards_tags"."created_by_id" is \'Member who created the tag.\';');
    this.addSql('comment on column "boards_tags"."description" is \'Brief description of what the tag is about.\';');
    this.addSql('comment on column "boards_tags"."name" is \'Name of the tag.\';');

    this.addSql('create table "boards_tasks_tags" ("board_task_entity_id" uuid not null, "board_tags_entity_id" uuid not null, constraint "boards_tasks_tags_pkey" primary key ("board_task_entity_id", "board_tags_entity_id"));');

    this.addSql('alter table "boards_tags" add constraint "boards_tags_created_by_id_foreign" foreign key ("created_by_id") references "auth_users" ("id") on update cascade;');

    this.addSql('alter table "boards_tasks_tags" add constraint "boards_tasks_tags_board_task_entity_id_foreign" foreign key ("board_task_entity_id") references "boards_tasks" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "boards_tasks_tags" add constraint "boards_tasks_tags_board_tags_entity_id_foreign" foreign key ("board_tags_entity_id") references "boards_tags" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks_tags" drop constraint "boards_tasks_tags_board_tags_entity_id_foreign";');

    this.addSql('drop table if exists "boards_tags" cascade;');

    this.addSql('drop table if exists "boards_tasks_tags" cascade;');
  }

}
