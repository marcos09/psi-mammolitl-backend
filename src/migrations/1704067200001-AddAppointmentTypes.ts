import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointmentTypes1704067200001 implements MigrationInterface {
  name = 'AddAppointmentTypes1704067200001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign key constraint for appointment type (if not already exists)
    await queryRunner.query(`
      ALTER TABLE "time_slots" 
      ADD CONSTRAINT "FK_time_slots_appointment_type" 
      FOREIGN KEY ("appointmentTypeId") 
      REFERENCES "appointment_types"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Update time slots with different appointment types and addresses
    await queryRunner.query(`
      UPDATE "time_slots" 
      SET "appointmentTypeId" = 2, "address" = 'Professional Building, Suite 200, 123 Main St, City, State 12345'
      WHERE id % 3 = 1 AND id > 0
    `);

    await queryRunner.query(`
      UPDATE "time_slots" 
      SET "appointmentTypeId" = 3, "address" = 'Client Address - To be provided'
      WHERE id % 3 = 2 AND id > 0
    `);

    // Update meeting links for online appointments
    await queryRunner.query(`
      UPDATE "time_slots" 
      SET "meetingLink" = 'https://meet.google.com/psi-session-' || id
      WHERE "appointmentTypeId" = 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reset time slots to default online appointments
    await queryRunner.query(`
      UPDATE "time_slots" 
      SET "appointmentTypeId" = 1, "meetingLink" = 'https://meet.google.com/psi-session-' || id, "address" = NULL
    `);

    // Remove foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "time_slots" 
      DROP CONSTRAINT "FK_time_slots_appointment_type"
    `);
  }
}
