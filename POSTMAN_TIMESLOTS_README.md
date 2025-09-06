# PSI Mammoliti - Time Slots API Postman Collection

This Postman collection provides comprehensive testing for all Time Slots API endpoints with appointment type filtering capabilities.

## 📁 Files Included

- `PSI_Mammoliti_Timeslots_API.postman_collection.json` - Main Postman collection
- `PSI_Mammoliti_Timeslots_Environment.postman_environment.json` - Environment variables
- `POSTMAN_TIMESLOTS_README.md` - This documentation

## 🚀 Quick Start

1. **Import Collection**: Import `PSI_Mammoliti_Timeslots_API.postman_collection.json` into Postman
2. **Import Environment**: Import `PSI_Mammoliti_Timeslots_Environment.postman_environment.json` into Postman
3. **Select Environment**: Choose "PSI Mammoliti - Time Slots Environment" in Postman
4. **Start Server**: Ensure your NestJS server is running on `http://localhost:3000`

## 📋 Collection Structure

### 1. Time Slots - Basic Operations
- **GET** `/time-slots` - Get all time slots (available only by default)
- **GET** `/time-slots?isAvailable=false` - Get all time slots including unavailable
- **GET** `/time-slots/:id` - Get specific time slot by ID
- **POST** `/time-slots` - Create new time slot
- **PUT** `/time-slots/:id` - Update time slot
- **PUT** `/time-slots/:id/unavailable` - Mark as unavailable
- **PUT** `/time-slots/:id/available` - Mark as available
- **DELETE** `/time-slots/:id` - Delete time slot

### 2. Time Slots - Filtering & Queries
- **GET** `/time-slots/bookable` - Get bookable time slots (available + future)
- **GET** `/time-slots?psychologistId=1` - Filter by psychologist
- **GET** `/time-slots?specializationId=1` - Filter by specialization
- **GET** `/time-slots?appointmentTypeId=1` - Filter by appointment type
- **GET** `/time-slots?futureOnly=true` - Filter by future only
- **GET** `/time-slots?startDate=...&endDate=...` - Filter by date range

### 3. Time Slots - Combined Filters
- **GET** `/time-slots?psychologistId=1&appointmentTypeId=1` - Psychologist + appointment type
- **GET** `/time-slots?specializationId=1&appointmentTypeId=2` - Specialization + appointment type
- **GET** `/time-slots?psychologistId=1&futureOnly=true&isAvailable=true` - Complex filtering
- **GET** `/time-slots?psychologistId=1&specializationId=1&appointmentTypeId=1&futureOnly=true&startDate=...&endDate=...` - All parameters

### 4. Time Slots - Bookable Endpoint Filters
- **GET** `/time-slots/bookable` - All bookable time slots
- **GET** `/time-slots/bookable?psychologistId=1` - Bookable by psychologist
- **GET** `/time-slots/bookable?specializationId=1` - Bookable by specialization
- **GET** `/time-slots/bookable?appointmentTypeId=1` - Bookable by appointment type
- **GET** `/time-slots/bookable?startDate=...&endDate=...` - Bookable by date range
- **GET** `/time-slots/bookable?psychologistId=1&appointmentTypeId=1&startDate=...&endDate=...` - Complex bookable filtering

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3000` | Base URL for the API |
| `api_version` | `v1` | API version |
| `content_type` | `application/json` | Content type for requests |
| `psychologist_id` | `1` | Sample psychologist ID for testing |
| `specialization_id` | `1` | Sample specialization ID for testing |
| `appointment_type_online` | `1` | Online appointment type ID |
| `appointment_type_onsite` | `2` | On-site appointment type ID |
| `appointment_type_athome` | `3` | At-home appointment type ID |
| `sample_start_date` | `2024-01-15T00:00:00Z` | Sample start date for filtering |
| `sample_end_date` | `2024-01-31T23:59:59Z` | Sample end date for filtering |

## 📝 Sample Request Bodies

### Create Time Slot - Online Appointment
```json
{
  "startTime": "2024-02-15T09:00:00Z",
  "endTime": "2024-02-15T10:00:00Z",
  "isAvailable": true,
  "notes": "Morning consultation slot",
  "psychologistId": 1,
  "appointmentTypeId": 1,
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "address": null
}
```

### Create Time Slot - On-Site Appointment
```json
{
  "startTime": "2024-02-15T14:00:00Z",
  "endTime": "2024-02-15T15:00:00Z",
  "isAvailable": true,
  "notes": "Afternoon consultation slot",
  "psychologistId": 1,
  "appointmentTypeId": 2,
  "meetingLink": null,
  "address": "123 Main St, City, State 12345"
}
```

### Create Time Slot - At-Home Appointment
```json
{
  "startTime": "2024-02-15T16:00:00Z",
  "endTime": "2024-02-15T17:00:00Z",
  "isAvailable": true,
  "notes": "Evening consultation slot",
  "psychologistId": 1,
  "appointmentTypeId": 3,
  "meetingLink": null,
  "address": "Client Address - To be provided"
}
```

## 🎯 Key Features Tested

### 1. **Default Behavior**
- GET `/time-slots` returns only available time slots by default
- No need to specify `isAvailable=true` for most use cases

### 2. **Appointment Type Filtering**
- **Online (ID: 1)**: Requires `meetingLink`, no `address`
- **On-Site (ID: 2)**: Requires `address`, no `meetingLink`
- **At-Home (ID: 3)**: Requires `address`, no `meetingLink`

### 3. **Flexible Filtering**
- All query parameters are optional
- Can combine any filters together
- Supports date range filtering
- Supports future-only filtering

### 4. **Bookable Endpoint**
- `/time-slots/bookable` is optimized for booking scenarios
- Always returns available + future time slots
- Supports all the same filtering options

## 🔍 Testing Scenarios

### Basic CRUD Operations
1. Create a time slot with different appointment types
2. Retrieve the created time slot
3. Update the time slot
4. Mark as unavailable/available
5. Delete the time slot

### Filtering Scenarios
1. Filter by psychologist
2. Filter by specialization
3. Filter by appointment type
4. Filter by date range
5. Combine multiple filters

### Booking Scenarios
1. Get all bookable time slots
2. Get bookable time slots for specific psychologist
3. Get bookable time slots for specific appointment type
4. Get bookable time slots within date range

## 🚨 Important Notes

1. **Server Required**: Ensure your NestJS server is running before testing
2. **Database**: Make sure your database is properly seeded with test data
3. **Validation**: All requests include proper validation examples
4. **Error Handling**: Test with invalid IDs and data to verify error responses
5. **Environment**: Update environment variables if your server runs on different port

## 📊 Expected Response Format

### Success Response
```json
{
  "id": 1,
  "startTime": "2024-02-15T09:00:00.000Z",
  "endTime": "2024-02-15T10:00:00.000Z",
  "isAvailable": true,
  "notes": "Morning consultation slot",
  "psychologistId": 1,
  "appointmentTypeId": 1,
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "address": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "psychologist": { ... },
  "appointmentType": { ... }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## 🔄 Collection Updates

This collection is designed to be easily maintainable:
- Environment variables for easy configuration
- Clear naming conventions
- Comprehensive documentation
- Sample data for all scenarios
- Organized folder structure

## 📞 Support

For questions or issues with the API or this collection, refer to the main project documentation or contact the development team.
