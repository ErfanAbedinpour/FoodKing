import { Migration } from '@mikro-orm/migrations';

export class Migration20250416124822 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "session" add column "token_id" varchar(255) not null, add column "exp" bigint not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" drop column "token_id", drop column "exp";`);
  }

}
