import { IsEmail, IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe', description: 'Client full name' })
  @IsString()
  clientName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Client email address',
  })
  @IsEmail()
  clientEmail: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Client phone number',
  })
  @IsOptional()
  @IsString()
  clientPhone?: string;

  @ApiPropertyOptional({
    example: 'First consultation',
    description: 'Optional booking notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 5, description: 'ID of the time slot to book' })
  @IsNumber()
  timeSlotId: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the specialization for this booking',
  })
  @IsNumber()
  specializationId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the appointment type for this booking',
  })
  @IsNumber()
  appointmentTypeId: number;

  @ApiPropertyOptional({
    example: '456 Client St, Client City, State 54321',
    description:
      'Client address for home visits (required for at_home appointment type)',
  })
  @IsOptional()
  @IsString()
  clientAddress?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Client full name' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Client email address',
  })
  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Client phone number',
  })
  @IsOptional()
  @IsString()
  clientPhone?: string;

  @ApiPropertyOptional({
    example: 'First consultation',
    description: 'Optional booking notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID of the time slot to book',
  })
  @IsOptional()
  @IsNumber()
  timeSlotId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of the specialization for this booking',
  })
  @IsOptional()
  @IsNumber()
  specializationId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the appointment type for this booking',
  })
  @IsOptional()
  @IsNumber()
  appointmentTypeId?: number;

  @ApiPropertyOptional({
    example: '456 Client St, Client City, State 54321',
    description: 'Client address for home visits',
  })
  @IsOptional()
  @IsString()
  clientAddress?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'confirmed',
    description: 'Booking status',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status: string;
}
