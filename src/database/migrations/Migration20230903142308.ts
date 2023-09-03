import { Migration } from '@mikro-orm/migrations';

export class Migration20230903142308 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks_comments" add column "reply_to_id" uuid null;');
    this.addSql('comment on column "boards_tasks_comments"."reply_to_id" is \'Comment to which this comment is replying.\';');
    this.addSql('alter table "boards_tasks_comments" add constraint "boards_tasks_comments_reply_to_id_foreign" foreign key ("reply_to_id") references "boards_tasks_comments" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks_comments" drop constraint "boards_tasks_comments_reply_to_id_foreign";');

    this.addSql('alter table "boards_tasks_comments" drop column "reply_to_id";');
  }

}
