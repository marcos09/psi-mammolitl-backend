import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddPsychologistAppointmentTypes1704067200002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'psychologist_appointment_types',
        columns: [
          {
            name: 'psychologistId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'appointmentTypeId',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['psychologistId'],
            referencedTableName: 'psychologists',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['appointmentTypeId'],
            referencedTableName: 'appointment_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Insert psychologist-appointment type relationships
    // All psychologists can do online consultations
    await queryRunner.query(`
      INSERT INTO psychologist_appointment_types ("psychologistId", "appointmentTypeId") VALUES
      (1, 1), (1, 2), (1, 3), -- Dr. Smith: All types
      (2, 1), (2, 2), -- Dr. Jones: Online and On-site
      (3, 1), (3, 3), -- Dr. Wilson: Online and At-home
      (4, 1), (4, 2), (4, 3), -- Dr. Brown: All types
      (5, 1), (5, 2), -- Dr. Davis: Online and On-site
      (6, 1), (6, 3), -- Dr. Miller: Online and At-home
      (7, 1), (7, 2), (7, 3), -- Dr. Garcia: All types
      (8, 1), (8, 2), -- Dr. Martinez: Online and On-site
      (9, 1), (9, 2), (9, 3), -- Dr. Anderson: All types
      (10, 1), (10, 3) -- Dr. Taylor: Online and At-home
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('psychologist_appointment_types');
  }
}
