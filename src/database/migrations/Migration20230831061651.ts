import { Migration } from '@mikro-orm/migrations';

export class Migration20230831061651 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_tokens" add column "revoked" bool not null default false;');
    this.addSql('comment on column "auth_tokens"."revoked" is \'Token revocation status.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_tokens" drop column "revoked";');
  }

}
