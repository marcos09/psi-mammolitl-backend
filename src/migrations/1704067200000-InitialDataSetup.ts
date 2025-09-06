import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDataSetup1704067200000 implements MigrationInterface {
  name = 'InitialDataSetup1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Specializations
    await queryRunner.query(`
      INSERT INTO specializations (name, description, "createdAt", "updatedAt") VALUES
      ('Cognitive Behavioral Therapy', 'CBT for anxiety, depression, and trauma', NOW(), NOW()),
      ('Family Therapy', 'Family and couples counseling', NOW(), NOW()),
      ('Child Psychology', 'Specialized therapy for children and adolescents', NOW(), NOW()),
      ('Addiction Counseling', 'Treatment for substance abuse and behavioral addictions', NOW(), NOW()),
      ('Trauma Therapy', 'EMDR and trauma-focused interventions', NOW(), NOW())
    `);

    // Insert Psychologists
    await queryRunner.query(`
      INSERT INTO psychologists (email, "firstName", "lastName", phone, "licenseNumber", "isActive", "createdAt", "updatedAt") VALUES
      ('dr.smith@example.com', 'John', 'Smith', '+1234567890', 'PSY123456', true, NOW(), NOW()),
      ('dr.jones@example.com', 'Sarah', 'Jones', '+1987654321', 'PSY789012', true, NOW(), NOW()),
      ('dr.wilson@example.com', 'Michael', 'Wilson', '+1555123456', 'PSY345678', true, NOW(), NOW()),
      ('dr.brown@example.com', 'Emily', 'Brown', '+1555987654', 'PSY901234', true, NOW(), NOW()),
      ('dr.davis@example.com', 'David', 'Davis', '+1555555555', 'PSY567890', true, NOW(), NOW()),
      ('dr.miller@example.com', 'Lisa', 'Miller', '+1555444444', 'PSY123789', true, NOW(), NOW()),
      ('dr.garcia@example.com', 'Carlos', 'Garcia', '+1555333333', 'PSY456123', true, NOW(), NOW()),
      ('dr.martinez@example.com', 'Maria', 'Martinez', '+1555222222', 'PSY789456', true, NOW(), NOW()),
      ('dr.anderson@example.com', 'Jennifer', 'Anderson', '+1555111111', 'PSY234567', true, NOW(), NOW()),
      ('dr.taylor@example.com', 'Robert', 'Taylor', '+1555000000', 'PSY890123', true, NOW(), NOW())
    `);

    // Insert Psychologist-Specialization relationships
    await queryRunner.query(`
      INSERT INTO psychologist_specializations ("psychologistId", "specializationId") VALUES
      (1, 1), (1, 2), -- Dr. Smith: CBT, Family Therapy
      (2, 1), (2, 3), -- Dr. Jones: CBT, Child Psychology
      (3, 2), (3, 4), -- Dr. Wilson: Family Therapy, Addiction Counseling
      (4, 1), (4, 5), -- Dr. Brown: CBT, Trauma Therapy
      (5, 3), (5, 4), -- Dr. Davis: Child Psychology, Addiction Counseling
      (6, 2), (6, 3), -- Dr. Miller: Family Therapy, Child Psychology
      (7, 1), (7, 4), -- Dr. Garcia: CBT, Addiction Counseling
      (8, 3), (8, 5), -- Dr. Martinez: Child Psychology, Trauma Therapy
      (9, 1), (9, 2), (9, 5), -- Dr. Anderson: CBT, Family Therapy, Trauma Therapy
      (10, 2), (10, 4) -- Dr. Taylor: Family Therapy, Addiction Counseling
    `);

    // Generate time slots for the next 30 days for each psychologist
    const startDate = new Date();
    startDate.setHours(9, 0, 0, 0); // Start at 9 AM

    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      // Create 3 time slots per day for each psychologist (9-10, 10-11, 11-12)
      for (let psychologistId = 1; psychologistId <= 10; psychologistId++) {
        for (let hour = 9; hour <= 11; hour++) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);

          const slotEnd = new Date(currentDate);
          slotEnd.setHours(hour + 1, 0, 0, 0);

          await queryRunner.query(
            `
            INSERT INTO time_slots ("startTime", "endTime", "isAvailable", notes, "psychologistId", "createdAt", "updatedAt") VALUES
            ($1, $2, true, $3, $4, NOW(), NOW())
          `,
            [
              slotStart.toISOString(),
              slotEnd.toISOString(),
              `${hour}:00 - ${hour + 1}:00 consultation slot`,
              psychologistId,
            ],
          );
        }
      }
    }

    // Create some booked time slots (mark some as unavailable and create bookings)
    const bookedSlots = [
      {
        timeSlotId: 1,
        clientName: 'Alice Johnson',
        clientEmail: 'alice.johnson@example.com',
        clientPhone: '+1111111111',
        specializationId: 1,
        notes: 'First CBT session',
      },
      {
        timeSlotId: 2,
        clientName: 'Bob Williams',
        clientEmail: 'bob.williams@example.com',
        clientPhone: '+2222222222',
        specializationId: 2,
        notes: 'Family therapy consultation',
      },
      {
        timeSlotId: 5,
        clientName: 'Carol Davis',
        clientEmail: 'carol.davis@example.com',
        clientPhone: '+3333333333',
        specializationId: 3,
        notes: 'Child psychology assessment',
      },
      {
        timeSlotId: 8,
        clientName: 'Daniel Brown',
        clientEmail: 'daniel.brown@example.com',
        clientPhone: '+4444444444',
        specializationId: 1,
        notes: 'CBT follow-up session',
      },
      {
        timeSlotId: 12,
        clientName: 'Eva Wilson',
        clientEmail: 'eva.wilson@example.com',
        clientPhone: '+5555555555',
        specializationId: 4,
        notes: 'Addiction counseling initial consultation',
      },
      {
        timeSlotId: 15,
        clientName: 'Frank Miller',
        clientEmail: 'frank.miller@example.com',
        clientPhone: '+6666666666',
        specializationId: 5,
        notes: 'Trauma therapy session',
      },
      {
        timeSlotId: 18,
        clientName: 'Grace Garcia',
        clientEmail: 'grace.garcia@example.com',
        clientPhone: '+7777777777',
        specializationId: 2,
        notes: 'Couples therapy session',
      },
      {
        timeSlotId: 22,
        clientName: 'Henry Martinez',
        clientEmail: 'henry.martinez@example.com',
        clientPhone: '+8888888888',
        specializationId: 3,
        notes: 'Adolescent therapy session',
      },
      {
        timeSlotId: 25,
        clientName: 'Ivy Anderson',
        clientEmail: 'ivy.anderson@example.com',
        clientPhone: '+9999999999',
        specializationId: 1,
        notes: 'CBT anxiety treatment',
      },
      {
        timeSlotId: 28,
        clientName: 'Jack Taylor',
        clientEmail: 'jack.taylor@example.com',
        clientPhone: '+1010101010',
        specializationId: 4,
        notes: 'Substance abuse counseling',
      },
    ];

    for (const booking of bookedSlots) {
      // Mark time slot as unavailable
      await queryRunner.query(
        `
        UPDATE time_slots SET "isAvailable" = false WHERE id = $1
      `,
        [booking.timeSlotId],
      );

      // Create booking
      await queryRunner.query(
        `
        INSERT INTO bookings ("clientName", "clientEmail", "clientPhone", notes, status, "timeSlotId", "specializationId", "createdAt", "updatedAt") VALUES
        ($1, $2, $3, $4, 'confirmed', $5, $6, NOW(), NOW())
      `,
        [
          booking.clientName,
          booking.clientEmail,
          booking.clientPhone,
          booking.notes,
          booking.timeSlotId,
          booking.specializationId,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove bookings
    await queryRunner.query(`DELETE FROM bookings`);

    // Remove time slots
    await queryRunner.query(`DELETE FROM time_slots`);

    // Remove psychologist-specialization relationships
    await queryRunner.query(`DELETE FROM psychologist_specializations`);

    // Remove psychologists
    await queryRunner.query(`DELETE FROM psychologists`);

    // Remove specializations
    await queryRunner.query(`DELETE FROM specializations`);
  }
}
