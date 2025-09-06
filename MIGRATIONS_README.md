# TypeORM Migrations Setup

This project includes TypeORM migrations to set up initial test data for the PSI Mammoliti Backend API.

## What's Included

The initial data migration (`1704067200000-InitialDataSetup.ts`) creates:

### Specializations (5)
1. **Cognitive Behavioral Therapy** - CBT for anxiety, depression, and trauma
2. **Family Therapy** - Family and couples counseling
3. **Child Psychology** - Specialized therapy for children and adolescents
4. **Addiction Counseling** - Treatment for substance abuse and behavioral addictions
5. **Trauma Therapy** - EMDR and trauma-focused interventions

### Psychologists (10)
1. **Dr. John Smith** - CBT, Family Therapy
2. **Dr. Sarah Jones** - CBT, Child Psychology
3. **Dr. Michael Wilson** - Family Therapy, Addiction Counseling
4. **Dr. Emily Brown** - CBT, Trauma Therapy
5. **Dr. David Davis** - Child Psychology, Addiction Counseling
6. **Dr. Lisa Miller** - Family Therapy, Child Psychology
7. **Dr. Carlos Garcia** - CBT, Addiction Counseling
8. **Dr. Maria Martinez** - Child Psychology, Trauma Therapy
9. **Dr. Jennifer Anderson** - CBT, Family Therapy, Trauma Therapy
10. **Dr. Robert Taylor** - Family Therapy, Addiction Counseling

### Time Slots
- **10+ time slots per psychologist** for the next 30 days
- **3 slots per day** (9-10 AM, 10-11 AM, 11-12 PM)
- **Weekdays only** (Monday to Friday)
- **Total: ~450 time slots** across all psychologists

### Sample Bookings (10)
- Various clients with different specializations
- Mix of confirmed bookings
- Realistic client information

## Running Migrations

### Prerequisites
1. Make sure PostgreSQL is running
2. Create a database named `psi_mammoliti` (or update the database name in your environment)
3. Update your `.env` file with correct database credentials

### Commands

#### Run Migrations
```bash
npm run migration:run
```

#### Revert Last Migration
```bash
npm run migration:revert
```

#### Generate New Migration (after entity changes)
```bash
npm run migration:generate -- src/migrations/YourMigrationName
```

## Environment Setup

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=psi_mammoliti
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_SSL=false

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Set `DB_SYNCHRONIZE=false` when using migrations to avoid conflicts.

### Environment Configuration
The application uses `src/config/environment.config.ts` to manage environment variables. Make sure your `.env` file is in the project root directory.

## Testing the Data

After running migrations, you can test the API endpoints:

### Get All Specializations
```bash
curl http://localhost:3000/specializations
```

### Get All Psychologists
```bash
curl http://localhost:3000/psychologists
```

### Get Available Time Slots by Specialization
```bash
curl http://localhost:3000/time-slots/available/specialization/1
```

### Get Available Future Time Slots for a Psychologist
```bash
curl http://localhost:3000/time-slots/psychologist/1/available/future
```

### Get All Bookings
```bash
curl http://localhost:3000/bookings
```

## Data Structure

### Time Slots Schedule
- **Monday to Friday only**
- **9:00 AM - 10:00 AM**
- **10:00 AM - 11:00 AM**
- **11:00 AM - 12:00 PM**

### Sample Booking Data
- 10 confirmed bookings across different psychologists
- Various specializations represented
- Realistic client information
- Time slots automatically marked as unavailable when booked

## Troubleshooting

### Migration Fails
1. Check database connection settings
2. Ensure database exists
3. Verify user has proper permissions
4. Check if tables already exist (migration might have run before)

### Path Alias Issues
If you get errors like "Cannot find module '@/entities/base.entity'":
- This is resolved by using `entities: []` in ormconfig.ts for migrations
- Path aliases work fine in the NestJS application but not in TypeORM CLI
- Migrations don't need entity definitions, only the migration files

### Data Not Appearing
1. Verify migration ran successfully
2. Check database directly: `SELECT * FROM specializations;`
3. Ensure application is connecting to the same database

### Rollback Issues
1. Check migration history: migrations table should exist
2. Ensure you're not trying to rollback the first migration
3. Verify database permissions for DROP operations

## Next Steps

After running the initial migration:

1. **Start the application**: `npm run start:dev`
2. **Test endpoints** using the Postman collection
3. **Create additional bookings** through the API
4. **Modify time slots** as needed
5. **Add more psychologists** or specializations as required

The migration provides a solid foundation for testing all API functionality with realistic data.
