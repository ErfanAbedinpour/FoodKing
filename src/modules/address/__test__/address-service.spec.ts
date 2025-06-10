import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { EntityManager } from '@mikro-orm/core';
import { Address } from '../../../models';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

describe('AddressService', () => {
  let addressService: AddressService;
  let mockEntityManager =  {
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    assign: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  const mockAddress = {
    id: 1,
    city: 'Test City',
    state: 'Test State',
    zip_code: '12345',
    street: 'Test Street',
    country: 'Test Country',
    user: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const createAddressDto: CreateAddressDto = {
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        street: 'Test Street',
        country: 'Test Country',
      };

      mockEntityManager.create?.mockReturnValue(mockAddress);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await addressService.create(1, createAddressDto);

      expect(mockEntityManager.create).toHaveBeenCalledWith(Address, {
        city: 'Test City',
        state: 'Test State',
        zip_code: '12345',
        street: 'Test Street',
        user: 1,
      });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockAddress);
      expect(result).toEqual(mockAddress);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const createAddressDto: CreateAddressDto = {
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        street: 'Test Street',
        country: 'Test Country',
      };

      mockEntityManager.create.mockReturnValue(mockAddress);
      mockEntityManager.persistAndFlush.mockRejectedValue(new Error('Database error'));

      await expect(addressService.create(1, createAddressDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all addresses for a user', async () => {
      const addresses = [mockAddress];
      mockEntityManager.find.mockResolvedValue(addresses);

      const result = await addressService.findAll(1);

      expect(mockEntityManager.find).toHaveBeenCalledWith(Address, { user: 1 });
      expect(result).toEqual(addresses);
    });
  });

  describe('findOne', () => {
    it('should return an address', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockAddress);

      const result = await addressService.findOne(1, 1);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Address, { id: 1, user: 1 });
      expect(result).toEqual(mockAddress);
    });

    it('should throw NotFoundException if address not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(addressService.findOne(1, 1)).rejects.toThrow(NotFoundException);
      await expect(addressService.findOne(1, 1)).rejects.toThrow('Address not found');
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const updateAddressDto: UpdateAddressDto = {
        city: 'Updated City',
        state: 'Updated State',
        zipCode: '67890',
        street: 'Updated Street',
        country: 'Updated Country',
      };

      const updatedAddress = { ...mockAddress, ...updateAddressDto };
      
      mockEntityManager.findOne.mockResolvedValue(mockAddress);
      mockEntityManager.assign.mockReturnValue(updatedAddress);
      mockEntityManager.flush.mockResolvedValue(undefined);

      const result = await addressService.update(1, 1, updateAddressDto);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Address, { id: 1, user: 1 });
      expect(mockEntityManager.assign).toHaveBeenCalledWith(mockAddress, updateAddressDto);
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(updatedAddress);
    });

    it('should throw NotFoundException if address not found', async () => {
      const updateAddressDto: UpdateAddressDto = {
        city: 'Updated City',
      };

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(addressService.update(1, 1, updateAddressDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error during update', async () => {
      const updateAddressDto: UpdateAddressDto = {
        city: 'Updated City',
        state: 'Updated State',
        zipCode: '67890',
        street: 'Updated Street',
        country: 'Updated Country',
      };

      mockEntityManager.findOne.mockResolvedValue(mockAddress);
      mockEntityManager.assign.mockReturnValue(mockAddress);
      mockEntityManager.flush.mockRejectedValue(new Error('Database error'));

      await expect(addressService.update(1, 1, updateAddressDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockAddress);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      await addressService.remove(1, 1);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Address, { id: 1, user: 1 });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(mockAddress);
    });

    it('should throw NotFoundException if address not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(addressService.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error during removal', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockAddress);
      mockEntityManager.removeAndFlush.mockRejectedValue(new Error('Database error'));

      await expect(addressService.remove(1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
