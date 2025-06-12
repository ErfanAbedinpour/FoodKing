import { Migration } from '@mikro-orm/migrations';

export class Migration20250612050355 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "transactions" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "amount" numeric(10,2) not null, "provider" text check ("provider" in ('zarinpal', 'zipal')) not null, "authority" varchar(255) not null, "status" text check ("status" in ('Pending', 'Success', 'Failed')) null default 'Pending', "transaction_id" varchar(255) null, "transaction_type" varchar(255) not null default 'payment', "order_id" int not null);`);

    this.addSql(`alter table "transactions" add constraint "transactions_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "payments" cascade;`);

    this.addSql(`alter table "orders" drop constraint if exists "orders_status_check";`);

    this.addSql(`alter table "orders" add constraint "orders_status_check" check("status" in ('processing', 'Shipped', 'Cancelled', 'WaitingForPayment'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "payments" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "amount" numeric(10,2) not null, "provider" text check ("provider" in ('zarinpal', 'zipal')) not null, "authority" varchar(255) not null, "status" text check ("status" in ('Pending', 'Success', 'Failed')) not null default 'Pending', "transaction_id" varchar(255) null, "user_id" int not null, "order_id" int not null);`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_unique" unique ("order_id");`);

    this.addSql(`alter table "payments" add constraint "payments_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade;`);

    this.addSql(`drop table if exists "transactions" cascade;`);

    this.addSql(`alter table "orders" drop constraint if exists "orders_status_check";`);

    this.addSql(`alter table "orders" add constraint "orders_status_check" check("status" in ('processing', 'Shipped', 'Delivered'));`);
  }

}
