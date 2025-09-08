import { IsOptional, IsDateString } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class SpecializationStatsDto {
  specializationId: number;
  specializationName: string;
  totalBookings: number;
  percentage: number;
}

export class DayStatsDto {
  dayOfWeek: string;
  date: string;
  totalSessions: number;
  percentage: number;
}

export class AppointmentTypeStatsDto {
  appointmentTypeId: number;
  appointmentTypeName: string;
  appointmentTypeCode: string;
  totalBookings: number;
  percentage: number;
}

export class PsychologistStatsDto {
  psychologistId: number;
  psychologistName: string;
  totalBookings: number;
  percentage: number;
}

export class AnalyticsResponseDto {
  mostConsultedSpecializations: SpecializationStatsDto[];
  busiestDays: DayStatsDto[];
  mostUsedAppointmentTypes: AppointmentTypeStatsDto[];
  mostBookedPsychologists: PsychologistStatsDto[];
  totalBookings: number;
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
}
