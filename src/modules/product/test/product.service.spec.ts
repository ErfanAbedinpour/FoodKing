import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '@models/product.model';
import { CreateProductDTO } from '../dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { RepositoryException } from '../../../exception/repository.exception';
import Decimal from 'decimal.js';
import { Collection } from '@mikro-orm/core';
import { User } from '@models/user.model';
import { Restaurant } from '@models/restaurant.model';
import { ProductCategory } from '@models/product-category.model';
import { Cart } from '@models/cart.model';
import { Order } from '@models/order.model';
import { ProductAttribute } from '@models/product-attribute.model';
import { Comment } from '@models/comment.model';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  const mockProductRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    slug: 'test-product',
    inventory: 10,
    price: new Decimal('99.99'),
    is_active: true,
    user: {} as User,
    restaurant: {} as Restaurant,
    category: new Collection<ProductCategory>({} as Product),
    carts: new Collection<Cart>({} as Product),
    orders: new Collection<Order>({} as Product),
    attributes: new Collection<ProductAttribute>({} as Product),
    comments: new Collection<Comment>({} as Product),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    const createProductDto: CreateProductDTO = {
      name: 'Test Product',
      description: 'Test Description',
      slug: 'test-product',
      inventory: 10,
      price: new Decimal('99.99'),
      categories: [1],
      restaurant_id: 1,
    };

    it('should create a product successfully', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto, 1);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        user_id: 1
      });
    });

    it('should handle repository errors', async () => {
      mockProductRepository.create.mockRejectedValue(new Error('Repository error'));

      expect(service.createProduct(createProductDto, 1)).rejects.toThrow();
    });
  });

  describe('getProductById', () => {
    it('should return a product when found', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.getProductById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProductBySlug', () => {
    it('should return a product when found', async () => {
      mockProductRepository.findBySlug.mockResolvedValue(mockProduct);

      const result = await service.getProductBySlug('test-product');

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findBySlug).toHaveBeenCalledWith('test-product');
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findBySlug.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.getProductBySlug('test-product')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    const updateData = {
      name: 'Updated Product',
      price: new Decimal('149.99'),
    };

    it('should update a product successfully', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue({ ...mockProduct, ...updateData });

      const result = await service.updateProduct(1, updateData);

      expect(result).toEqual({ ...mockProduct, ...updateData });
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.updateProduct(1, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct(1);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.deleteProduct(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateInventory', () => {
    it('should update inventory successfully', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue({ ...mockProduct, inventory: 5 });

      const result = await service.updateInventory(1, 5);

      expect(result).toEqual({ ...mockProduct, inventory: 5 });
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, { inventory: 5 });
    });

    it('should throw error when insufficient inventory', () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      expect(service.updateInventory(1, 15)).rejects.toThrow('Insufficient inventory');
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.updateInventory(1, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleProductStatus', () => {
    it('should toggle product status successfully', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue({ ...mockProduct, is_active: false });

      const result = await service.toggleProductStatus(1);

      expect(result).toEqual({ ...mockProduct, is_active: false });
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, { is_active: false });
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(new RepositoryException('Product not found'));

      expect(service.toggleProductStatus(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllProduct', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      mockProductRepository.getAll.mockResolvedValue(mockProducts);

      const result = await service.getAllProduct();

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.getAll).toHaveBeenCalled();
    });

    it('should handle repository errors', () => {
      mockProductRepository.getAll.mockRejectedValue(new Error('Repository error'));

      expect(service.getAllProduct()).rejects.toThrow();
    });
  });
}); 