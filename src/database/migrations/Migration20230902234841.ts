import { Migration } from '@mikro-orm/migrations';

export class Migration20230902234841 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_users" drop constraint auth_users_username_check;');
    this.addSql('alter table "auth_users" add constraint auth_users_username_check check(username ~* \'^[A-Za-z0-9_-]+$\');');

    this.addSql('alter table "auth_emails" drop constraint auth_emails_value_check;');
    this.addSql('alter table "auth_emails" add constraint auth_emails_value_check check(value ~* \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\');');

    this.addSql('alter table "boards_tags" add column "color" varchar not null;');
    this.addSql('comment on column "boards_tags"."color" is \'Custom color to display in the tag view.\';');
    this.addSql('alter table "boards_tags" add constraint boards_tags_color_check check(color ~* \'#[A-Za-z0-9]{1,6}\');');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_users" drop constraint auth_users_username_check;');
    this.addSql('alter table "auth_users" add constraint auth_users_username_check check(username ~ \'^[A-Za-z0-9_-]+$\');');

    this.addSql('alter table "auth_emails" drop constraint auth_emails_value_check;');
    this.addSql('alter table "auth_emails" add constraint auth_emails_value_check check(value ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\');');

    this.addSql('alter table "boards_tags" drop constraint boards_tags_color_check;');
    this.addSql('alter table "boards_tags" drop column "color";');
  }

}
