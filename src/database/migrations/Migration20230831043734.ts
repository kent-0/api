import { Migration } from '@mikro-orm/migrations';

export class Migration20230831043734 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_users" add constraint auth_users_email_check check(email ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\');');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_users" drop constraint auth_users_email_check;');
  }

}
