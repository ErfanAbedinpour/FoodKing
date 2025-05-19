import Decimal from 'decimal.js';
import { Category, Restaurant } from '../../../../models';

export class ProductPersist {
  name: string;

  description: string;

  slug: string;

  inventory: number;

  user_id: number;

  price: Decimal;

  categories: Category[];

  restaurant: Restaurant;

  is_active?: boolean;

  image?: string;
}
