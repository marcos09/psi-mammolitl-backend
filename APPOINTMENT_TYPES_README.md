# Appointment Types Feature

This document describes the new appointment types feature that allows psychologists to offer different types of consultations: Online, On-Site, and At-Home.

## Overview

The system now supports three types of appointments:

1. **Online Consultation** - Virtual consultation via video call
   - Requires: Meeting link
   - Example: Google Meet, Zoom, etc.

2. **On-Site Consultation** - In-person consultation at office/clinic
   - Requires: Office/clinic address
   - Client visits the psychologist's location

3. **At-Home Consultation** - Home visit consultation at client location
   - Requires: Psychologist's address (for billing/travel purposes)
   - Requires: Client address (where the visit will take place)

## Database Changes

### New Tables
- `appointment_types` - Stores the different types of appointments available

### Updated Tables
- `time_slots` - Added fields for appointment type, meeting link, and address
- `bookings` - Added field for client address (required for at-home visits)

## API Endpoints

### Appointment Types
- `GET /appointment-types` - Get all active appointment types
- `POST /appointment-types` - Create new appointment type
- `GET /appointment-types/:id` - Get appointment type by ID
- `PATCH /appointment-types/:id` - Update appointment type
- `DELETE /appointment-types/:id` - Soft delete appointment type

### Updated Time Slots
- `POST /time-slots` - Now requires `appointmentTypeId` and validates required fields based on type
- `PATCH /time-slots/:id` - Updated to handle appointment type changes

### Updated Bookings
- `POST /bookings` - Now validates client address requirement for at-home appointments
- `PATCH /bookings/:id` - Updated to handle appointment type changes

## Validation Rules

### Time Slot Creation/Update
- **Online**: `meetingLink` is required
- **On-Site/At-Home**: `address` is required
- `appointmentTypeId` is always required

### Booking Creation/Update
- **At-Home**: `clientAddress` is required
- **Online/On-Site**: `clientAddress` is optional

## Migration

Run the migration to add the new tables and columns:

```bash
npm run migration:run
```

## Example Usage

### Creating an Online Time Slot
```json
{
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T10:00:00Z",
  "psychologistId": 1,
  "appointmentTypeId": 1,
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

### Creating an At-Home Time Slot
```json
{
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T15:00:00Z",
  "psychologistId": 1,
  "appointmentTypeId": 3,
  "address": "123 Main St, City, State 12345"
}
```

### Creating a Booking for At-Home Appointment
```json
{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "timeSlotId": 5,
  "specializationId": 1,
  "clientAddress": "456 Client St, Client City, State 54321"
}
```

## Files Modified/Created

### New Files
- `src/entities/appointment-type.entity.ts`
- `src/dto/appointment-type.dto.ts`
- `src/services/appointment-type.service.ts`
- `src/controllers/appointment-type.controller.ts`
- `src/modules/appointment-type.module.ts`
- `src/migrations/1704067200001-AddAppointmentTypes.ts`

### Modified Files
- `src/entities/timeslot.entity.ts` - Added appointment type relationship and fields
- `src/entities/booking.entity.ts` - Added client address field
- `src/dto/timeslot.dto.ts` - Added appointment type validation
- `src/dto/booking.dto.ts` - Added client address field
- `src/services/timeslot.service.ts` - Added appointment type validation
- `src/services/booking.service.ts` - Added client address validation
- `src/modules/timeslot.module.ts` - Added AppointmentType entity
- `src/modules/booking.module.ts` - Added AppointmentType entity
- `src/app.module.ts` - Added AppointmentTypeModule
