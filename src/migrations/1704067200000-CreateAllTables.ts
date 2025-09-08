import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1704067200000 implements MigrationInterface {
  name = 'CreateAllTables1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create appointment_types table
    await queryRunner.query(`
      CREATE TABLE "appointment_types" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "code" character varying NOT NULL,
        "description" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_appointment_types_name" UNIQUE ("name"),
        CONSTRAINT "UQ_appointment_types_code" UNIQUE ("code"),
        CONSTRAINT "PK_appointment_types" PRIMARY KEY ("id")
      )
    `);

    // Create specializations table
    await queryRunner.query(`
      CREATE TABLE "specializations" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_specializations_name" UNIQUE ("name"),
        CONSTRAINT "PK_specializations" PRIMARY KEY ("id")
      )
    `);

    // Create psychologists table
    await queryRunner.query(`
      CREATE TABLE "psychologists" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "phone" character varying,
        "licenseNumber" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_psychologists_email" UNIQUE ("email"),
        CONSTRAINT "UQ_psychologists_licenseNumber" UNIQUE ("licenseNumber"),
        CONSTRAINT "PK_psychologists" PRIMARY KEY ("id")
      )
    `);

    // Create psychologist_specializations junction table
    await queryRunner.query(`
      CREATE TABLE "psychologist_specializations" (
        "psychologistId" integer NOT NULL,
        "specializationId" integer NOT NULL,
        CONSTRAINT "PK_psychologist_specializations" PRIMARY KEY ("psychologistId", "specializationId")
      )
    `);

    // Create psychologist_appointment_types junction table
    await queryRunner.query(`
      CREATE TABLE "psychologist_appointment_types" (
        "psychologistId" integer NOT NULL,
        "appointmentTypeId" integer NOT NULL,
        CONSTRAINT "PK_psychologist_appointment_types" PRIMARY KEY ("psychologistId", "appointmentTypeId")
      )
    `);

    // Create time_slots table
    await queryRunner.query(`
      CREATE TABLE "time_slots" (
        "id" SERIAL NOT NULL,
        "startTime" TIMESTAMP NOT NULL,
        "endTime" TIMESTAMP NOT NULL,
        "isAvailable" boolean NOT NULL DEFAULT true,
        "notes" character varying,
        "psychologistId" integer NOT NULL,
        "appointmentTypeId" integer NOT NULL,
        "meetingLink" character varying,
        "address" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_time_slots" PRIMARY KEY ("id")
      )
    `);

    // Create bookings table
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" SERIAL NOT NULL,
        "clientName" character varying NOT NULL,
        "clientEmail" character varying NOT NULL,
        "clientPhone" character varying,
        "notes" character varying,
        "status" character varying NOT NULL DEFAULT 'pending',
        "clientAddress" character varying,
        "timeSlotId" integer NOT NULL,
        "specializationId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_bookings_timeSlotId" UNIQUE ("timeSlotId"),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "psychologist_specializations" 
      ADD CONSTRAINT "FK_psychologist_specializations_psychologistId" 
      FOREIGN KEY ("psychologistId") 
      REFERENCES "psychologists"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "psychologist_specializations" 
      ADD CONSTRAINT "FK_psychologist_specializations_specializationId" 
      FOREIGN KEY ("specializationId") 
      REFERENCES "specializations"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "psychologist_appointment_types" 
      ADD CONSTRAINT "FK_psychologist_appointment_types_psychologistId" 
      FOREIGN KEY ("psychologistId") 
      REFERENCES "psychologists"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "psychologist_appointment_types" 
      ADD CONSTRAINT "FK_psychologist_appointment_types_appointmentTypeId" 
      FOREIGN KEY ("appointmentTypeId") 
      REFERENCES "appointment_types"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "time_slots" 
      ADD CONSTRAINT "FK_time_slots_psychologistId" 
      FOREIGN KEY ("psychologistId") 
      REFERENCES "psychologists"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "time_slots" 
      ADD CONSTRAINT "FK_time_slots_appointmentTypeId" 
      FOREIGN KEY ("appointmentTypeId") 
      REFERENCES "appointment_types"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "bookings" 
      ADD CONSTRAINT "FK_bookings_timeSlotId" 
      FOREIGN KEY ("timeSlotId") 
      REFERENCES "time_slots"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "bookings" 
      ADD CONSTRAINT "FK_bookings_specializationId" 
      FOREIGN KEY ("specializationId") 
      REFERENCES "specializations"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_time_slots_psychologistId" ON "time_slots" ("psychologistId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_time_slots_startTime" ON "time_slots" ("startTime")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_time_slots_isAvailable" ON "time_slots" ("isAvailable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_bookings_clientEmail" ON "bookings" ("clientEmail")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_psychologists_isActive" ON "psychologists" ("isActive")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_psychologists_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_status"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_clientEmail"`);
    await queryRunner.query(`DROP INDEX "IDX_time_slots_isAvailable"`);
    await queryRunner.query(`DROP INDEX "IDX_time_slots_startTime"`);
    await queryRunner.query(`DROP INDEX "IDX_time_slots_psychologistId"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_specializationId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_timeSlotId"`);
    await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_time_slots_appointmentTypeId"`);
    await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_time_slots_psychologistId"`);
    await queryRunner.query(`ALTER TABLE "psychologist_appointment_types" DROP CONSTRAINT "FK_psychologist_appointment_types_appointmentTypeId"`);
    await queryRunner.query(`ALTER TABLE "psychologist_appointment_types" DROP CONSTRAINT "FK_psychologist_appointment_types_psychologistId"`);
    await queryRunner.query(`ALTER TABLE "psychologist_specializations" DROP CONSTRAINT "FK_psychologist_specializations_specializationId"`);
    await queryRunner.query(`ALTER TABLE "psychologist_specializations" DROP CONSTRAINT "FK_psychologist_specializations_psychologistId"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "time_slots"`);
    await queryRunner.query(`DROP TABLE "psychologist_appointment_types"`);
    await queryRunner.query(`DROP TABLE "psychologist_specializations"`);
    await queryRunner.query(`DROP TABLE "psychologists"`);
    await queryRunner.query(`DROP TABLE "specializations"`);
    await queryRunner.query(`DROP TABLE "appointment_types"`);
  }
}
