import { IsNotEmpty, IsString } from 'class-validator';

export default class CategoryRequestDto {
  @IsNotEmpty()
  @IsString()
    name:string;
}
