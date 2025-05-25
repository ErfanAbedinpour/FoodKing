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
  Put,
} from '@nestjs/common';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  async addresses(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  async address(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  async updateAddress(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  async removeAddress(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    await this.addressService.remove(id);
    return true;
  }
}
