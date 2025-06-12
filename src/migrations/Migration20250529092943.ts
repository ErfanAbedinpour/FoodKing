import { Migration } from '@mikro-orm/migrations';

export class Migration20250529092943 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Address" drop column "postal_code", drop column "province";`);

    this.addSql(`alter table "Address" add column "zip_code" varchar(255) not null, add column "city" text not null, add column "state" text not null;`);
    this.addSql(`alter table "Address" alter column "latitude" type int using ("latitude"::int);`);
    this.addSql(`alter table "Address" alter column "latitude" drop not null;`);
    this.addSql(`alter table "Address" alter column "longitude" type int using ("longitude"::int);`);
    this.addSql(`alter table "Address" alter column "longitude" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "Address" drop column "city", drop column "state";`);

    this.addSql(`alter table "Address" add column "province" varchar(255) not null;`);
    this.addSql(`alter table "Address" alter column "latitude" type int using ("latitude"::int);`);
    this.addSql(`alter table "Address" alter column "latitude" set not null;`);
    this.addSql(`alter table "Address" alter column "longitude" type int using ("longitude"::int);`);
    this.addSql(`alter table "Address" alter column "longitude" set not null;`);
    this.addSql(`alter table "Address" rename column "zip_code" to "postal_code";`);
  }

}
