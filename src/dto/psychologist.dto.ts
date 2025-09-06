import { IsEmail, IsString, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePsychologistDto {
  @ApiProperty({ example: 'dr.smith@example.com', description: 'Psychologist email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'Psychologist first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith', description: 'Psychologist last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Psychologist phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'PSY123456', description: 'Professional license number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether the psychologist is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: [1, 2], description: 'Array of specialization IDs', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  specializationIds?: number[];
}

export class UpdatePsychologistDto {
  @ApiPropertyOptional({ example: 'dr.smith@example.com', description: 'Psychologist email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John', description: 'Psychologist first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Smith', description: 'Psychologist last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Psychologist phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'PSY123456', description: 'Professional license number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether the psychologist is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: [1, 2], description: 'Array of specialization IDs', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  specializationIds?: number[];
}
