import { OmitType, PartialType } from "@nestjs/swagger";
import { SubMenuDTO } from "./sub-menu.DTO";

export class UpdateSubMenuDTO extends PartialType(OmitType(SubMenuDTO, ["createdAt", 'updatedAt', 'id'])) { }

