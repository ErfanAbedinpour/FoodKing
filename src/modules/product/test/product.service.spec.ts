import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '@models/product.model';
import { CreateProductDTO } from '../dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { RepositoryException } from '../../common/exception/repository.exception';
import Decimal from 'decimal.js';
import { Restaurant } from '@models/restaurant.model';
import { CategoryService } from '../../category/category.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { Category } from '../../../models';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { StorageService } from '../../storage/storage.service';

describe('ProductService', () => {
  let service: ProductService;
  let mockStorageService: jest.Mocked<StorageService> = {
    get: jest.fn(),
    upload: jest.fn(),
    remove: jest.fn(),
    signImageUrl: jest.fn()
  }

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
        {
          provide: StorageService,
          useValue: mockStorageService
        }
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
    is_active: true,
    image: 'test-image',
    createdAt: Date.now(),
    restaurant: { id: 2, name: 'test-restaurant' }
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
      rating: 2,
    });

    it('should create a product successfully', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      mockStorageService.signImageUrl.mockReturnValue('test-image-orginal');
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
      expect(result.rating).toEqual(2);

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
        image: 'products/1234567890-test-name',
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
  });

  describe('getProductById', () => {
    it('should return a product when it is found', async () => {

      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);

      expect(result).toEqual({ ...mockProduct });
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.findById.mockRejectedValue(
        new RepositoryException('Product not found'),
      );

      expect(service.getProductById(1)).rejects.toThrow('Product not found');
      expect(mockStorageService.signImageUrl).not.toHaveBeenCalled();
    });
  });

  describe('getProductBySlug', () => {
    it('should return a product if it is exists', async () => {
      mockStorageService.signImageUrl.mockReturnValue('test-image-orginal');
      mockProductRepository.findBySlug.mockResolvedValue(mockProduct);


      const result = await service.getProductBySlug('test-product');

      expect(result).toEqual({ ...mockProduct, image: 'test-image-orginal', restaurant: 2, attributes: [], category: [], createdAt: mockProduct.createdAt.toString(), price: mockProduct.price.toString(), rating: 0 });
      expect(mockProductRepository.findBySlug).toHaveBeenCalledWith(
        'test-product',
      );
      expect(mockStorageService.signImageUrl).toHaveBeenCalledWith(mockProduct.image);
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
    const updateData = {
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

      mockStorageService.signImageUrl.mockReturnValue('test-image-orginal');

      const mockCategory = [
        { id: 2, name: 'test-category-1' },
        { id: 3, name: 'test-category-2' },
      ] as Category[];

      mockCategoryService.findAllByIds.mockResolvedValue(mockCategory);

      mockRestaurantService.findOne.mockResolvedValue(mockRestaurant);

      const updatedResult = {
        ...mockProduct,
        id: 1,
        name: updateData.name,
        price: updateData.price,
        category: { toJSON: () => mockCategory },
        restaurant: mockRestaurant,
      };

      mockProductRepository.update.mockResolvedValue(updatedResult);

      const result = await service.updateProduct(1, updateData);

      expect(result.name).toEqual(updateData.name);
      expect(result.price).toEqual(updateData.price.toString());
      expect(result.category).toEqual(mockCategory);
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
      mockStorageService.remove.mockResolvedValue(true);

      mockProductRepository.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct(1);

      expect(result.success).toEqual(true);
      expect(result.deletedId).toEqual(mockProduct.id);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(mockStorageService.remove).toHaveBeenCalledWith(mockProduct.image);
    });

    it('should throw NotFoundException when product not found', () => {
      mockProductRepository.delete.mockRejectedValue(
        new RepositoryException('Product not found'),
      );

      expect(service.deleteProduct(1)).rejects.toThrow('Product not found');
    });
  });

  describe('updateInventory', () => {
    it('inventory should be 5 ', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      mockProductRepository.update.mockResolvedValue({
        ...mockProduct,
        inventory: 5,
      });

      const result = await service.updateInventory(1, -5);
      expect(result.inventory).toEqual(5);
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
        inventory: 5,
      });
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

      expect(result.is_active).toEqual(false);
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
