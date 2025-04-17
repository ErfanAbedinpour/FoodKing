import { Migration } from '@mikro-orm/migrations';

export class Migration20250416125014 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "session" alter column "token" type text using ("token"::text);`);
    this.addSql(`alter table "session" alter column "token_id" drop default;`);
    this.addSql(`alter table "session" alter column "token_id" type uuid using ("token_id"::text::uuid);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" alter column "token_id" type text using ("token_id"::text);`);

    this.addSql(`alter table "session" alter column "token" type varchar(255) using ("token"::varchar(255));`);
    this.addSql(`alter table "session" alter column "token_id" type varchar(255) using ("token_id"::varchar(255));`);
  }

}
