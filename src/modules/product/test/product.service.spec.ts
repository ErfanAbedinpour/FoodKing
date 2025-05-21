import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '@models/product.model';
import { CreateProductDTO } from '../dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { RepositoryException } from '../../../exception/repository.exception';
import Decimal from 'decimal.js';
import { Restaurant } from '@models/restaurant.model';
import { CategoryService } from '../../category/category.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { Category } from '../../../models';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;

  const mockRestaurantService = {
    findOne: jest.fn(),
  };

  const mockCategoryService = {
    findAllByIds: jest.fn(),
  };

  const mockProductRepository = Object.freeze({
    create: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },

        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockProduct = Object.freeze({
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    slug: 'test-product',
    inventory: 10,
    price: Decimal('120000'),
    en_name: 'test Product',
    is_active: true,
    image: 'test-image',
  });
  describe('createProduct', () => {
    const createProductDto: CreateProductDTO = Object.freeze({
      name: 'Test Product',
      description: 'Test Description',
      slug: 'test-product',
      inventory: 10,
      price: new Decimal('99.99'),
      categories: [1],
      restaurant_id: 1,
    });

    it('should create a product successfully', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      mockProductRepository.create.mockResolvedValue({
        id: 1,
        name: 'Test Product',
      } as Product);

      mockCategoryService.findAllByIds.mockResolvedValue([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ] as Category[]);

      mockRestaurantService.findOne.mockResolvedValue({} as Restaurant);

      const result = await service.createProduct(createProductDto, 1, {
        originalname: 'test-name',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File);

      expect(result.id).toEqual(1);
      expect(result.name).toEqual('Test Product');

      const copyDto = { ...createProductDto, user_id: 1 };
      Reflect.deleteProperty(copyDto, 'restaurant_id');
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        ...copyDto,
        user_id: 1,
        restaurant: {},
        categories: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
        image: '1234567890-test-name',
      });

      expect(mockCategoryService.findAllByIds).toHaveBeenCalledWith([1]);
    });

    it('Should Return NotFound Error If Restaurant NotFounded', async () => {
      mockRestaurantService.findOne.mockRejectedValueOnce(
        new NotFoundException('Restaurant Not Founded'),
      );

      expect(
        service.createProduct(createProductDto, 1, {} as Express.Multer.File),
      ).rejects.toThrow('Restaurant Not Founded');
    });

    describe('getProductById', () => {
      it('should return a product when found', async () => {
        mockProductRepository.findById.mockResolvedValue(mockProduct);

        const result = await service.getProductById(1);

        expect(result).toEqual(mockProduct);
        expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.findById.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.getProductById(1)).rejects.toThrow('Product not found');
      });
    });

    describe('getProductBySlug', () => {
      it('should return a product when found', async () => {
        mockProductRepository.findBySlug.mockResolvedValue(mockProduct);

        const result = await service.getProductBySlug('test-product');

        expect(result).toEqual(mockProduct);
        expect(mockProductRepository.findBySlug).toHaveBeenCalledWith(
          'test-product',
        );
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.findBySlug.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.getProductBySlug('test-product')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateProduct', () => {
      const updateData: UpdateProductDto = {
        name: 'Updated Product',
        price: Decimal('120000'),
        categories: [1, 2, 3],
        restaurant_id: 3,
      };

      it('should update a product successfully', async () => {
        const mockRestaurant = {
          id: 5,
          name: 'test-restaurant',
        };

        const mockCategory = [
          { id: 2, name: 'test-category-1' },
          { id: 3, name: 'test-category-2' },
        ] as Category[];

        mockCategoryService.findAllByIds.mockResolvedValue(mockCategory);

        mockRestaurantService.findOne.mockResolvedValue(mockRestaurant);

        const updatedResult = {
          id: 1,
          name: updateData.name,
          price: updateData.price,
          category: mockCategory,
          restaurant: mockRestaurant,
        };

        mockProductRepository.update.mockResolvedValue(updatedResult);

        const result = await service.updateProduct(1, updateData);

        expect(result).toEqual(updatedResult);
        expect(result.restaurant.id).toEqual(5);
        expect(result.category.length).toEqual(2);
        expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
          name: updateData.name,
          price: updateData.price,
          categories: mockCategory,
          restaurant: mockRestaurant,
        });
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.update.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.updateProduct(1, updateData)).rejects.toThrow(
          'Product not found',
        );
      });
    });

    describe('deleteProduct', () => {
      it('should delete The product successfully', async () => {
        mockProductRepository.delete.mockResolvedValue(mockProduct);

        const result = await service.deleteProduct(1);

        expect(result).toEqual(mockProduct);
        expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.delete.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.deleteProduct(1)).rejects.toThrow('Product not found');
      });
    });

    describe('updateInventory', () => {
      it('should update inventory successfully', async () => {
        mockProductRepository.findById.mockResolvedValue(mockProduct);

        mockProductRepository.update.mockResolvedValue({
          ...mockProduct,
          inventory: 5,
        });

        const result = await service.updateInventory(1, 5);

        expect(result).toEqual({ ...mockProduct, inventory: 5 });
        expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
          inventory: 5,
        });
      });

      it('should throw error when insufficient inventory', () => {
        mockProductRepository.findById.mockResolvedValue(mockProduct);

        expect(service.updateInventory(1, 15)).rejects.toThrow(
          'Insufficient inventory',
        );
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.findById.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.updateInventory(1, 5)).rejects.toThrow(
          'Product not found',
        );
      });
    });

    describe('toggleProductStatus', () => {
      it('should toggle product status successfully', async () => {
        mockProductRepository.findById.mockResolvedValue(mockProduct);

        mockProductRepository.update.mockResolvedValue({
          ...mockProduct,
          is_active: false,
        });

        const result = await service.toggleProductStatus(1);

        expect(result).toEqual({ ...mockProduct, is_active: false });
        expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
          is_active: false,
        });
      });

      it('should throw NotFoundException when product not found', () => {
        mockProductRepository.findById.mockRejectedValue(
          new RepositoryException('Product not found'),
        );

        expect(service.toggleProductStatus(1)).rejects.toThrow(
          'Product not found',
        );
      });
    });
  });
});
