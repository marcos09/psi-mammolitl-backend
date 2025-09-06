import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecializationDto {
  @ApiProperty({ example: 'Cognitive Behavioral Therapy', description: 'Name of the specialization' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'CBT for anxiety and depression', description: 'Description of the specialization' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSpecializationDto {
  @ApiPropertyOptional({ example: 'Cognitive Behavioral Therapy', description: 'Name of the specialization' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'CBT for anxiety and depression', description: 'Description of the specialization' })
  @IsOptional()
  @IsString()
  description?: string;
}
