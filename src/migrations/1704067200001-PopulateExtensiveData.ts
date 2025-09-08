import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateExtensiveData1704067200001 implements MigrationInterface {
  name = 'PopulateExtensiveData1704067200001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert comprehensive appointment types
    await queryRunner.query(`
      INSERT INTO appointment_types (name, code, description, "isActive", "createdAt", "updatedAt") VALUES
      ('Online Consultation', 'online', 'Virtual consultation via video call with secure platform', true, NOW(), NOW()),
      ('On-Site Consultation', 'on_site', 'In-person consultation at professional office or clinic', true, NOW(), NOW()),
      ('At-Home Consultation', 'at_home', 'Home visit consultation at client location for accessibility', true, NOW(), NOW()),
      ('Group Therapy Session', 'group', 'Therapeutic group session with multiple participants', true, NOW(), NOW()),
      ('Emergency Consultation', 'emergency', 'Urgent psychological consultation for crisis situations', true, NOW(), NOW()),
      ('Assessment Session', 'assessment', 'Comprehensive psychological evaluation and testing', true, NOW(), NOW()),
      ('Follow-up Session', 'followup', 'Regular follow-up session for ongoing treatment', true, NOW(), NOW()),
      ('Family Therapy Session', 'family', 'Family-centered therapeutic intervention', true, NOW(), NOW())
    `);

    // Insert comprehensive specializations
    await queryRunner.query(`
      INSERT INTO specializations (name, description, "createdAt", "updatedAt") VALUES
      ('Cognitive Behavioral Therapy (CBT)', 'Evidence-based treatment for anxiety, depression, and behavioral issues', NOW(), NOW()),
      ('Family Therapy', 'Systemic approach to family and couples counseling', NOW(), NOW()),
      ('Child & Adolescent Psychology', 'Specialized therapy for children and teenagers', NOW(), NOW()),
      ('Addiction Counseling', 'Treatment for substance abuse and behavioral addictions', NOW(), NOW()),
      ('Trauma Therapy', 'EMDR, trauma-focused CBT, and trauma-informed care', NOW(), NOW()),
      ('Anxiety Disorders', 'Specialized treatment for various anxiety disorders', NOW(), NOW()),
      ('Depression Treatment', 'Evidence-based approaches for depression management', NOW(), NOW()),
      ('Eating Disorders', 'Treatment for anorexia, bulimia, and binge eating disorders', NOW(), NOW()),
      ('Personality Disorders', 'Specialized treatment for borderline and other personality disorders', NOW(), NOW()),
      ('Grief Counseling', 'Support for loss, bereavement, and life transitions', NOW(), NOW()),
      ('Couples Therapy', 'Relationship counseling and communication skills', NOW(), NOW()),
      ('Autism Spectrum Support', 'Specialized support for individuals with ASD', NOW(), NOW()),
      ('ADHD Treatment', 'Comprehensive treatment for attention deficit disorders', NOW(), NOW()),
      ('PTSD Treatment', 'Specialized trauma therapy for post-traumatic stress', NOW(), NOW()),
      ('LGBTQ+ Affirmative Therapy', 'Culturally competent therapy for LGBTQ+ individuals', NOW(), NOW()),
      ('Geriatric Psychology', 'Mental health support for elderly populations', NOW(), NOW()),
      ('Sports Psychology', 'Mental performance and psychological support for athletes', NOW(), NOW()),
      ('Forensic Psychology', 'Psychological assessment and treatment in legal contexts', NOW(), NOW())
    `);

    // Insert diverse psychologists with realistic data
    await queryRunner.query(`
      INSERT INTO psychologists (email, "firstName", "lastName", phone, "licenseNumber", "isActive", "createdAt", "updatedAt") VALUES
      ('dr.smith@psychologycenter.com', 'Dr. Sarah', 'Smith', '+1-555-0101', 'PSY-2024-001', true, NOW(), NOW()),
      ('dr.johnson@psychologycenter.com', 'Dr. Michael', 'Johnson', '+1-555-0102', 'PSY-2024-002', true, NOW(), NOW()),
      ('dr.williams@psychologycenter.com', 'Dr. Emily', 'Williams', '+1-555-0103', 'PSY-2024-003', true, NOW(), NOW()),
      ('dr.brown@psychologycenter.com', 'Dr. David', 'Brown', '+1-555-0104', 'PSY-2024-004', true, NOW(), NOW()),
      ('dr.jones@psychologycenter.com', 'Dr. Lisa', 'Jones', '+1-555-0105', 'PSY-2024-005', true, NOW(), NOW()),
      ('dr.garcia@psychologycenter.com', 'Dr. Carlos', 'Garcia', '+1-555-0106', 'PSY-2024-006', true, NOW(), NOW()),
      ('dr.miller@psychologycenter.com', 'Dr. Jennifer', 'Miller', '+1-555-0107', 'PSY-2024-007', true, NOW(), NOW()),
      ('dr.davis@psychologycenter.com', 'Dr. Robert', 'Davis', '+1-555-0108', 'PSY-2024-008', true, NOW(), NOW()),
      ('dr.rodriguez@psychologycenter.com', 'Dr. Maria', 'Rodriguez', '+1-555-0109', 'PSY-2024-009', true, NOW(), NOW()),
      ('dr.martinez@psychologycenter.com', 'Dr. James', 'Martinez', '+1-555-0110', 'PSY-2024-010', true, NOW(), NOW()),
      ('dr.hernandez@psychologycenter.com', 'Dr. Patricia', 'Hernandez', '+1-555-0111', 'PSY-2024-011', true, NOW(), NOW()),
      ('dr.lopez@psychologycenter.com', 'Dr. Christopher', 'Lopez', '+1-555-0112', 'PSY-2024-012', true, NOW(), NOW()),
      ('dr.gonzalez@psychologycenter.com', 'Dr. Amanda', 'Gonzalez', '+1-555-0113', 'PSY-2024-013', true, NOW(), NOW()),
      ('dr.wilson@psychologycenter.com', 'Dr. Kevin', 'Wilson', '+1-555-0114', 'PSY-2024-014', true, NOW(), NOW()),
      ('dr.anderson@psychologycenter.com', 'Dr. Michelle', 'Anderson', '+1-555-0115', 'PSY-2024-015', true, NOW(), NOW()),
      ('dr.thomas@psychologycenter.com', 'Dr. Daniel', 'Thomas', '+1-555-0116', 'PSY-2024-016', true, NOW(), NOW()),
      ('dr.taylor@psychologycenter.com', 'Dr. Stephanie', 'Taylor', '+1-555-0117', 'PSY-2024-017', true, NOW(), NOW()),
      ('dr.moore@psychologycenter.com', 'Dr. Anthony', 'Moore', '+1-555-0118', 'PSY-2024-018', true, NOW(), NOW()),
      ('dr.jackson@psychologycenter.com', 'Dr. Jessica', 'Jackson', '+1-555-0119', 'PSY-2024-019', true, NOW(), NOW()),
      ('dr.martin@psychologycenter.com', 'Dr. Matthew', 'Martin', '+1-555-0120', 'PSY-2024-020', true, NOW(), NOW()),
      ('dr.lee@psychologycenter.com', 'Dr. Ashley', 'Lee', '+1-555-0121', 'PSY-2024-021', true, NOW(), NOW()),
      ('dr.perez@psychologycenter.com', 'Dr. Ryan', 'Perez', '+1-555-0122', 'PSY-2024-022', true, NOW(), NOW()),
      ('dr.thompson@psychologycenter.com', 'Dr. Nicole', 'Thompson', '+1-555-0123', 'PSY-2024-023', true, NOW(), NOW()),
      ('dr.white@psychologycenter.com', 'Dr. Brandon', 'White', '+1-555-0124', 'PSY-2024-024', true, NOW(), NOW()),
      ('dr.harris@psychologycenter.com', 'Dr. Samantha', 'Harris', '+1-555-0125', 'PSY-2024-025', true, NOW(), NOW())
    `);

    // Create psychologist-specialization relationships (more realistic distribution)
    await queryRunner.query(`
      INSERT INTO psychologist_specializations ("psychologistId", "specializationId") VALUES
      -- Dr. Sarah Smith (1) - CBT specialist with trauma focus
      (1, 1), (1, 5), (1, 6), (1, 7),
      -- Dr. Michael Johnson (2) - Family and couples therapy
      (2, 2), (2, 11), (2, 8), (2, 10),
      -- Dr. Emily Williams (3) - Child and adolescent specialist
      (3, 3), (3, 12), (3, 13), (3, 1),
      -- Dr. David Brown (4) - Addiction and trauma specialist
      (4, 4), (4, 5), (4, 14), (4, 6),
      -- Dr. Lisa Jones (5) - Eating disorders and anxiety
      (5, 8), (5, 6), (5, 1), (5, 7),
      -- Dr. Carlos Garcia (6) - LGBTQ+ and trauma specialist
      (6, 15), (6, 5), (6, 14), (6, 1),
      -- Dr. Jennifer Miller (7) - Personality disorders and CBT
      (7, 9), (7, 1), (7, 6), (7, 7),
      -- Dr. Robert Davis (8) - Grief counseling and family therapy
      (8, 10), (8, 2), (8, 11), (8, 1),
      -- Dr. Maria Rodriguez (9) - Geriatric and depression specialist
      (9, 16), (9, 7), (9, 1), (9, 10),
      -- Dr. James Martinez (10) - Sports psychology and ADHD
      (10, 17), (10, 13), (10, 1), (10, 6),
      -- Dr. Patricia Hernandez (11) - Forensic psychology and trauma
      (11, 18), (11, 5), (11, 14), (11, 1),
      -- Dr. Christopher Lopez (12) - Autism spectrum and child psychology
      (12, 12), (12, 3), (12, 13), (12, 1),
      -- Dr. Amanda Gonzalez (13) - Anxiety and depression specialist
      (13, 6), (13, 7), (13, 1), (13, 8),
      -- Dr. Kevin Wilson (14) - PTSD and trauma therapy
      (14, 14), (14, 5), (14, 1), (14, 6),
      -- Dr. Michelle Anderson (15) - Couples and family therapy
      (15, 11), (15, 2), (15, 1), (15, 10),
      -- Dr. Daniel Thomas (16) - ADHD and child psychology
      (16, 13), (16, 3), (16, 1), (16, 6),
      -- Dr. Stephanie Taylor (17) - Eating disorders and body image
      (17, 8), (17, 1), (17, 6), (17, 7),
      -- Dr. Anthony Moore (18) - Addiction and family therapy
      (18, 4), (18, 2), (18, 1), (18, 10),
      -- Dr. Jessica Jackson (19) - LGBTQ+ and anxiety specialist
      (19, 15), (19, 6), (19, 1), (19, 7),
      -- Dr. Matthew Martin (20) - Depression and grief counseling
      (20, 7), (20, 10), (20, 1), (20, 6),
      -- Dr. Ashley Lee (21) - Trauma and PTSD specialist
      (21, 5), (21, 14), (21, 1), (21, 6),
      -- Dr. Ryan Perez (22) - Child psychology and autism
      (22, 3), (22, 12), (22, 13), (22, 1),
      -- Dr. Nicole Thompson (23) - Family therapy and couples
      (23, 2), (23, 11), (23, 1), (23, 10),
      -- Dr. Brandon White (24) - Anxiety and sports psychology
      (24, 6), (24, 17), (24, 1), (24, 7),
      -- Dr. Samantha Harris (25) - Geriatric and depression
      (25, 16), (25, 7), (25, 1), (25, 10)
    `);

    // Create psychologist-appointment type relationships
    await queryRunner.query(`
      INSERT INTO psychologist_appointment_types ("psychologistId", "appointmentTypeId") VALUES
      -- All psychologists can do online consultations
      (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
      (11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1),
      (21, 1), (22, 1), (23, 1), (24, 1), (25, 1),
      -- On-site consultations (most psychologists)
      (1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
      (11, 2), (12, 2), (13, 2), (14, 2), (15, 2), (16, 2), (17, 2), (18, 2), (19, 2), (20, 2),
      (21, 2), (22, 2), (23, 2), (24, 2), (25, 2),
      -- At-home consultations (selected psychologists)
      (1, 3), (2, 3), (4, 3), (6, 3), (8, 3), (9, 3), (11, 3), (13, 3), (15, 3), (17, 3),
      (19, 3), (21, 3), (23, 3), (25, 3),
      -- Group therapy sessions (specialists)
      (2, 4), (8, 4), (15, 4), (18, 4), (23, 4),
      -- Emergency consultations (trauma specialists)
      (1, 5), (4, 5), (6, 5), (11, 5), (14, 5), (21, 5),
      -- Assessment sessions (specialists)
      (3, 6), (12, 6), (16, 6), (22, 6),
      -- Follow-up sessions (all psychologists)
      (1, 7), (2, 7), (3, 7), (4, 7), (5, 7), (6, 7), (7, 7), (8, 7), (9, 7), (10, 7),
      (11, 7), (12, 7), (13, 7), (14, 7), (15, 7), (16, 7), (17, 7), (18, 7), (19, 7), (20, 7),
      (21, 7), (22, 7), (23, 7), (24, 7), (25, 7),
      -- Family therapy sessions
      (2, 8), (8, 8), (15, 8), (18, 8), (23, 8)
    `);

    // Generate comprehensive time slots for the next 90 days
    const startDate = new Date();
    startDate.setHours(8, 0, 0, 0); // Start at 8 AM

    const appointmentTypes = [1, 2, 3]; // online, on_site, at_home
    const timeSlots = [
      { start: 8, end: 9 },   // 8:00-9:00
      { start: 9, end: 10 },  // 9:00-10:00
      { start: 10, end: 11 }, // 10:00-11:00
      { start: 11, end: 12 }, // 11:00-12:00
      { start: 13, end: 14 }, // 1:00-2:00 PM
      { start: 14, end: 15 }, // 2:00-3:00 PM
      { start: 15, end: 16 }, // 3:00-4:00 PM
      { start: 16, end: 17 }, // 4:00-5:00 PM
      { start: 17, end: 18 }, // 5:00-6:00 PM
      { start: 18, end: 19 }, // 6:00-7:00 PM
    ];

    for (let day = 0; day < 90; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      // Skip weekends for most psychologists, but some work weekends
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const weekendPsychologists = [1, 4, 6, 11, 14, 21]; // Trauma specialists work weekends

      for (let psychologistId = 1; psychologistId <= 25; psychologistId++) {
        // Skip weekend slots for non-weekend psychologists
        if (isWeekend && !weekendPsychologists.includes(psychologistId)) {
          continue;
        }

        // Each psychologist has different availability patterns
        const availableSlots = psychologistId <= 10 ? timeSlots : timeSlots.slice(0, 8); // Senior psychologists work more hours
        
        for (const slot of availableSlots) {
          // Skip some slots randomly to create realistic availability
          if (Math.random() < 0.1) continue; // 10% chance of skipping a slot

          const slotStart = new Date(currentDate);
          slotStart.setHours(slot.start, 0, 0, 0);

          const slotEnd = new Date(currentDate);
          slotEnd.setHours(slot.end, 0, 0, 0);

          // Assign appointment type based on psychologist preferences
          let appointmentTypeId = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
          
          // Ensure the psychologist can do this appointment type
          const canDoOnline = true; // All can do online
          const canDoOnSite = true; // All can do on-site
          const canDoAtHome = [1, 2, 4, 6, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25].includes(psychologistId);
          
          if (appointmentTypeId === 3 && !canDoAtHome) {
            appointmentTypeId = 1; // Default to online if can't do at-home
          }

          const meetingLink = `https://meet.psychologycenter.com/session-${psychologistId}-${day}-${slot.start}`;
          const address = appointmentTypeId === 2 ? 
            `Professional Building, Suite ${200 + psychologistId}, 123 Main St, City, State 12345` : 
            (appointmentTypeId === 3 ? 'Client Address - To be provided' : null);

          await queryRunner.query(
            `
            INSERT INTO time_slots ("startTime", "endTime", "isAvailable", notes, "psychologistId", "appointmentTypeId", "meetingLink", "address", "createdAt", "updatedAt") VALUES
            ($1, $2, true, $3, $4, $5, $6, $7, NOW(), NOW())
          `,
            [
              slotStart.toISOString(),
              slotEnd.toISOString(),
              `${slot.start}:00 - ${slot.end}:00 consultation slot`,
              psychologistId,
              appointmentTypeId,
              meetingLink,
              address,
            ],
          );
        }
      }
    }

    // Create realistic bookings with diverse scenarios
    const bookingScenarios = [
      // Online consultations
      { timeSlotId: 1, clientName: 'Alice Johnson', clientEmail: 'alice.johnson@email.com', clientPhone: '+1-555-1001', specializationId: 1, notes: 'Initial CBT consultation for anxiety', clientAddress: null, status: 'confirmed' },
      { timeSlotId: 5, clientName: 'Bob Williams', clientEmail: 'bob.williams@email.com', clientPhone: '+1-555-1002', specializationId: 6, notes: 'Anxiety management session', clientAddress: null, status: 'confirmed' },
      { timeSlotId: 12, clientName: 'Carol Davis', clientEmail: 'carol.davis@email.com', clientPhone: '+1-555-1003', specializationId: 7, notes: 'Depression treatment follow-up', clientAddress: null, status: 'confirmed' },
      
      // On-site consultations
      { timeSlotId: 25, clientName: 'Daniel Brown', clientEmail: 'daniel.brown@email.com', clientPhone: '+1-555-1004', specializationId: 2, notes: 'Family therapy session', clientAddress: 'Professional Building, Suite 201, 123 Main St, City, State 12345', status: 'confirmed' },
      { timeSlotId: 35, clientName: 'Eva Wilson', clientEmail: 'eva.wilson@email.com', clientPhone: '+1-555-1005', specializationId: 11, notes: 'Couples counseling', clientAddress: 'Professional Building, Suite 202, 123 Main St, City, State 12345', status: 'confirmed' },
      
      // At-home consultations
      { timeSlotId: 45, clientName: 'Frank Miller', clientEmail: 'frank.miller@email.com', clientPhone: '+1-555-1006', specializationId: 3, notes: 'Child psychology assessment', clientAddress: '456 Oak Ave, City, State 12345', status: 'confirmed' },
      { timeSlotId: 55, clientName: 'Grace Garcia', clientEmail: 'grace.garcia@email.com', clientPhone: '+1-555-1007', specializationId: 15, notes: 'LGBTQ+ affirmative therapy', clientAddress: '789 Pine St, City, State 12345', status: 'confirmed' },
      
      // Trauma therapy
      { timeSlotId: 65, clientName: 'Henry Martinez', clientEmail: 'henry.martinez@email.com', clientPhone: '+1-555-1008', specializationId: 5, notes: 'Trauma therapy session', clientAddress: null, status: 'confirmed' },
      { timeSlotId: 75, clientName: 'Ivy Anderson', clientEmail: 'ivy.anderson@email.com', clientPhone: '+1-555-1009', specializationId: 14, notes: 'PTSD treatment', clientAddress: null, status: 'confirmed' },
      
      // Addiction counseling
      { timeSlotId: 85, clientName: 'Jack Taylor', clientEmail: 'jack.taylor@email.com', clientPhone: '+1-555-1010', specializationId: 4, notes: 'Substance abuse counseling', clientAddress: null, status: 'confirmed' },
      
      // Pending appointments
      { timeSlotId: 95, clientName: 'Kate Lopez', clientEmail: 'kate.lopez@email.com', clientPhone: '+1-555-1011', specializationId: 8, notes: 'Eating disorder consultation', clientAddress: null, status: 'pending' },
      { timeSlotId: 105, clientName: 'Liam Harris', clientEmail: 'liam.harris@email.com', clientPhone: '+1-555-1012', specializationId: 13, notes: 'ADHD assessment', clientAddress: null, status: 'pending' },
      
      // Completed appointments
      { timeSlotId: 115, clientName: 'Maya Thompson', clientEmail: 'maya.thompson@email.com', clientPhone: '+1-555-1013', specializationId: 10, notes: 'Grief counseling session', clientAddress: null, status: 'completed' },
      { timeSlotId: 125, clientName: 'Noah White', clientEmail: 'noah.white@email.com', clientPhone: '+1-555-1014', specializationId: 16, notes: 'Geriatric psychology consultation', clientAddress: null, status: 'completed' },
      
      // Cancelled appointments
      { timeSlotId: 135, clientName: 'Olivia Jackson', clientEmail: 'olivia.jackson@email.com', clientPhone: '+1-555-1015', specializationId: 9, notes: 'Personality disorder assessment', clientAddress: null, status: 'cancelled' },
    ];

    for (const booking of bookingScenarios) {
      // Mark time slot as unavailable
      await queryRunner.query(
        `UPDATE time_slots SET "isAvailable" = false WHERE id = $1`,
        [booking.timeSlotId],
      );

      // Create booking
      await queryRunner.query(
        `
        INSERT INTO bookings ("clientName", "clientEmail", "clientPhone", notes, status, "clientAddress", "timeSlotId", "specializationId", "createdAt", "updatedAt") VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `,
        [
          booking.clientName,
          booking.clientEmail,
          booking.clientPhone,
          booking.notes,
          booking.status,
          booking.clientAddress,
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

    // Remove psychologist-appointment type relationships
    await queryRunner.query(`DELETE FROM psychologist_appointment_types`);

    // Remove psychologist-specialization relationships
    await queryRunner.query(`DELETE FROM psychologist_specializations`);

    // Remove psychologists
    await queryRunner.query(`DELETE FROM psychologists`);

    // Remove specializations
    await queryRunner.query(`DELETE FROM specializations`);

    // Remove appointment types
    await queryRunner.query(`DELETE FROM appointment_types`);
  }
}
