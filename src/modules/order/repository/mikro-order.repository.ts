import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class MikroOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}
}
