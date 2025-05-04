import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMenuDTO } from './create-menu.dto';

export class UpdateMenuDTO extends PartialType(
  OmitType(CreateMenuDTO, ['sub_menu']),
) { }
