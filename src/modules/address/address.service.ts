import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '../../models';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);
  constructor(private readonly em: EntityManager) {}

  async create(
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const address = this.em.create(Address, {
      city: createAddressDto.city,
      state: createAddressDto.state,
      zip_code: createAddressDto.zipCode,
      street: createAddressDto.street,
      user: userId,
    });
    try {
      await this.em.persistAndFlush(address);
      return address;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: number): Promise<Address[]> {
    return this.em.find(Address, { user: userId });
  }

  async findOne(userId: number, id: number): Promise<Address> {
    const address = await this.em.findOne(Address, { id, user: userId });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async update(
    userId: number,
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(userId, id);
    const newAddress = this.em.assign(address, updateAddressDto);

    try {
      await this.em.flush();
      return newAddress;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async remove(userId: number, id: number): Promise<void> {
    const address = await this.findOne(userId, id);
    try {
      await this.em.removeAndFlush(address);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
