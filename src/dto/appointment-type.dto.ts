import { IsString, IsOptional, IsBoolean, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentTypeEnum } from '@/entities/appointment-type.entity';

export class CreateAppointmentTypeDto {
  @ApiProperty({
    example: 'Online Consultation',
    description: 'Name of the appointment type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'online',
    description: 'Code for the appointment type',
    enum: AppointmentTypeEnum,
  })
  @IsIn(Object.values(AppointmentTypeEnum))
  code: AppointmentTypeEnum;

  @ApiPropertyOptional({
    example: 'Virtual consultation via video call',
    description: 'Description of the appointment type',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the appointment type is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAppointmentTypeDto {
  @ApiPropertyOptional({
    example: 'Online Consultation',
    description: 'Name of the appointment type',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: 'online',
    description: 'Code for the appointment type',
    enum: AppointmentTypeEnum,
  })
  @IsOptional()
  @IsIn(Object.values(AppointmentTypeEnum))
  code?: AppointmentTypeEnum;

  @ApiPropertyOptional({
    example: 'Virtual consultation via video call',
    description: 'Description of the appointment type',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the appointment type is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
