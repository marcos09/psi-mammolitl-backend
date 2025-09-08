import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Specialization } from '@/entities/specialization.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import {
  AnalyticsQueryDto,
  AnalyticsResponseDto,
  SpecializationStatsDto,
  DayStatsDto,
  AppointmentTypeStatsDto,
  PsychologistStatsDto,
} from '@/dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(AppointmentType)
    private appointmentTypeRepository: Repository<AppointmentType>,
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
  ) {}

  async getAnalytics(query: AnalyticsQueryDto): Promise<AnalyticsResponseDto> {
    const { startDate, endDate } = query;
    
    // Build date filter
    const dateFilter = this.buildDateFilter(startDate, endDate);

    // Get all analytics data in parallel
    const [
      mostConsultedSpecializations,
      busiestDays,
      mostUsedAppointmentTypes,
      mostBookedPsychologists,
      totalBookings,
    ] = await Promise.all([
      this.getMostConsultedSpecializations(dateFilter),
      this.getBusiestDays(dateFilter),
      this.getMostUsedAppointmentTypes(dateFilter),
      this.getMostBookedPsychologists(dateFilter),
      this.getTotalBookings(dateFilter),
    ]);

    return {
      mostConsultedSpecializations,
      busiestDays,
      mostUsedAppointmentTypes,
      mostBookedPsychologists,
      totalBookings,
      dateRange: {
        startDate,
        endDate,
      },
    };
  }

  private async getMostConsultedSpecializations(dateFilter: any): Promise<SpecializationStatsDto[]> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.specialization', 'specialization')
      .select([
        'specialization.id as specializationId',
        'specialization.name as specializationName',
        'COUNT(booking.id) as totalBookings',
      ])
      .groupBy('specialization.id, specialization.name')
      .orderBy('totalBookings', 'DESC')
      .limit(10);

    if (dateFilter) {
      query.leftJoin('booking.timeSlot', 'timeSlot');
      query.where('timeSlot.startTime >= :startDate AND timeSlot.startTime <= :endDate', dateFilter);
    }

    const results = await query.getRawMany();
    
    // Filter out results where specializationId is null and convert to proper types
    const validResults = results
      .filter(item => item.specializationid !== null && item.specializationname !== null)
      .map(item => ({
        specializationId: parseInt(item.specializationid),
        specializationName: item.specializationname,
        totalBookings: parseInt(item.totalbookings) || 0,
      }));

    const total = validResults.reduce((sum, item) => sum + item.totalBookings, 0);

    return validResults.map(item => ({
      specializationId: item.specializationId,
      specializationName: item.specializationName,
      totalBookings: item.totalBookings,
      percentage: total > 0 ? (item.totalBookings / total) * 100 : 0,
    }));
  }

  private async getBusiestDays(dateFilter: any): Promise<DayStatsDto[]> {
    const query = this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .leftJoin('timeSlot.booking', 'booking')
      .select([
        'DATE(timeSlot.startTime) as date',
        'TO_CHAR(timeSlot.startTime, \'Day\') as dayOfWeek',
        'COUNT(booking.id) as totalSessions',
      ])
      .where('booking.id IS NOT NULL')
      .groupBy('DATE(timeSlot.startTime), TO_CHAR(timeSlot.startTime, \'Day\')')
      .orderBy('totalSessions', 'DESC')
      .limit(10);

    if (dateFilter) {
      query.andWhere('timeSlot.startTime >= :startDate AND timeSlot.startTime <= :endDate', dateFilter);
    }

    const results = await query.getRawMany();
    const total = results.reduce((sum, item) => sum + parseInt(item.totalsessions), 0);

    return results.map(item => ({
      dayOfWeek: item.dayofweek?.trim(),
      date: item.date,
      totalSessions: parseInt(item.totalsessions),
      percentage: total > 0 ? (parseInt(item.totalsessions) / total) * 100 : 0,
    }));
  }

  private async getMostUsedAppointmentTypes(dateFilter: any): Promise<AppointmentTypeStatsDto[]> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.timeSlot', 'timeSlot')
      .leftJoinAndSelect('timeSlot.appointmentType', 'appointmentType')
      .select([
        'appointmentType.id as appointmentTypeId',
        'appointmentType.name as appointmentTypeName',
        'appointmentType.code as appointmentTypeCode',
        'COUNT(booking.id) as totalBookings',
      ])
      .groupBy('appointmentType.id, appointmentType.name, appointmentType.code')
      .orderBy('totalBookings', 'DESC');

    if (dateFilter) {
      query.where('timeSlot.startTime >= :startDate AND timeSlot.startTime <= :endDate', dateFilter);
    }

    const results = await query.getRawMany();
    const total = results.reduce((sum, item) => sum + parseInt(item.totalbookings), 0);

    return results.map(item => ({
      appointmentTypeId: parseInt(item.appointmenttypeid),
      appointmentTypeName: item.appointmenttypename,
      appointmentTypeCode: item.appointmenttypecode,
      totalBookings: parseInt(item.totalbookings),
      percentage: total > 0 ? (parseInt(item.totalbookings) / total) * 100 : 0,
    }));
  }

  private async getMostBookedPsychologists(dateFilter: any): Promise<PsychologistStatsDto[]> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.timeSlot', 'timeSlot')
      .leftJoinAndSelect('timeSlot.psychologist', 'psychologist')
      .select([
        'psychologist.id as psychologistId',
        'CONCAT(psychologist.firstName, \' \', psychologist.lastName) as psychologistName',
        'COUNT(booking.id) as totalBookings',
      ])
      .groupBy('psychologist.id, psychologist.firstName, psychologist.lastName')
      .orderBy('totalBookings', 'DESC')
      .limit(10);

    if (dateFilter) {
      query.where('timeSlot.startTime >= :startDate AND timeSlot.startTime <= :endDate', dateFilter);
    }

    const results = await query.getRawMany();
    const total = results.reduce((sum, item) => sum + parseInt(item.totalbookings), 0);

    return results.map(item => ({
      psychologistId: parseInt(item.psychologistid),
      psychologistName: item.psychologistname,
      totalBookings: parseInt(item.totalbookings),
      percentage: total > 0 ? (parseInt(item.totalbookings) / total) * 100 : 0,
    }));
  }

  private async getTotalBookings(dateFilter: any): Promise<number> {
    const query = this.bookingRepository.createQueryBuilder('booking');

    if (dateFilter) {
      query.leftJoin('booking.timeSlot', 'timeSlot');
      query.where('timeSlot.startTime >= :startDate AND timeSlot.startTime <= :endDate', dateFilter);
    }

    return await query.getCount();
  }

  private buildDateFilter(startDate?: string, endDate?: string): any {
    if (!startDate && !endDate) {
      return null;
    }

    const filter: any = {};
    
    if (startDate) {
      filter.startDate = new Date(startDate);
    }
    
    if (endDate) {
      filter.endDate = new Date(endDate);
    }

    return filter;
  }
}
