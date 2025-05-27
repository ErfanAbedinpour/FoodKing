import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '../../models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsAuth } from '../common/decorator/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../common/decorator/getUser.decorator';

@Controller('addresses')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  async createAddress(
    @GetUser("userId") userId: number,
    @Body() createAddressDto: CreateAddressDto
  ): Promise<Address> {
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  async addresses(@GetUser("userId") userId: number): Promise<Address[]> {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  async address(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<Address> {

    return this.addressService.findOne(userId, id);
  }

  @Patch(':id')
  async updateAddress(
    @GetUser("userId") userId: number,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  async removeAddress(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<boolean> {

    await this.addressService.remove(userId, id);
    return true;
  }
}
