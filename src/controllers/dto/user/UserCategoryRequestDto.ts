import { IsNotEmpty, IsUUID } from 'class-validator';

export default class UserCategoryRequestDto {
  @IsNotEmpty()
  @IsUUID()
    categoryId: string;
}
