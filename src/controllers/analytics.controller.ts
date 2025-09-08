import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AnalyticsService } from '@/services/analytics.service';
import { AnalyticsQueryDto, AnalyticsResponseDto } from '@/dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(
    @Query(new ValidationPipe({ transform: true })) query: AnalyticsQueryDto,
  ): Promise<AnalyticsResponseDto> {
    return this.analyticsService.getAnalytics(query);
  }

  @Get('specializations')
  async getMostConsultedSpecializations(
    @Query(new ValidationPipe({ transform: true })) query: AnalyticsQueryDto,
  ) {
    const analytics = await this.analyticsService.getAnalytics(query);
    return {
      data: analytics.mostConsultedSpecializations,
      totalBookings: analytics.totalBookings,
      dateRange: analytics.dateRange,
    };
  }

  @Get('days')
  async getBusiestDays(
    @Query(new ValidationPipe({ transform: true })) query: AnalyticsQueryDto,
  ) {
    const analytics = await this.analyticsService.getAnalytics(query);
    return {
      data: analytics.busiestDays,
      totalBookings: analytics.totalBookings,
      dateRange: analytics.dateRange,
    };
  }

  @Get('appointment-types')
  async getMostUsedAppointmentTypes(
    @Query(new ValidationPipe({ transform: true })) query: AnalyticsQueryDto,
  ) {
    const analytics = await this.analyticsService.getAnalytics(query);
    return {
      data: analytics.mostUsedAppointmentTypes,
      totalBookings: analytics.totalBookings,
      dateRange: analytics.dateRange,
    };
  }

  @Get('psychologists')
  async getMostBookedPsychologists(
    @Query(new ValidationPipe({ transform: true })) query: AnalyticsQueryDto,
  ) {
    const analytics = await this.analyticsService.getAnalytics(query);
    return {
      data: analytics.mostBookedPsychologists,
      totalBookings: analytics.totalBookings,
      dateRange: analytics.dateRange,
    };
  }
}
