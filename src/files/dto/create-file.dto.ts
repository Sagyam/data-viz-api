import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the file',
    example: 'example.txt',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of the plot',
    example: 'barchart, linechart, boxplot etc.',
  })
  type: string;
}
