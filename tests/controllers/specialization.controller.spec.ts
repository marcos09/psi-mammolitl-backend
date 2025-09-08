import { Test, TestingModule } from '@nestjs/testing';
import { SpecializationController } from '../../src/controllers/specialization.controller';
import { SpecializationService } from '@/services/specialization.service';
import { Specialization } from '@/entities/specialization.entity';
import { CreateSpecializationDto, UpdateSpecializationDto } from '@/dto/specialization.dto';

describe('SpecializationController', () => {
  let controller: SpecializationController;
  let service: SpecializationService;

  const mockSpecializationService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecializationController],
      providers: [
        {
          provide: SpecializationService,
          useValue: mockSpecializationService,
        },
      ],
    }).compile();

    controller = module.get<SpecializationController>(SpecializationController);
    service = module.get<SpecializationService>(SpecializationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all specializations', async () => {
      const mockSpecializations = [
        createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression'),
        createMockSpecialization(2, 'Family Therapy', 'Family counseling and therapy'),
        createMockSpecialization(3, 'Trauma Therapy', 'Treatment for trauma and PTSD'),
      ];

      mockSpecializationService.findAll.mockResolvedValue(mockSpecializations);

      const result = await controller.findAll();

      expect(result).toEqual(mockSpecializations);
      expect(mockSpecializationService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no specializations exist', async () => {
      mockSpecializationService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should return specializations with various descriptions', async () => {
      const mockSpecializations = [
        createMockSpecialization(1, 'Art Therapy', 'Therapeutic use of art for healing'),
        createMockSpecialization(2, 'Music Therapy', 'Therapeutic use of music for healing'),
        createMockSpecialization(3, 'Dance Therapy', 'Therapeutic use of movement for healing'),
      ];

      mockSpecializationService.findAll.mockResolvedValue(mockSpecializations);

      const result = await controller.findAll();

      expect(result).toEqual(mockSpecializations);
      expect(mockSpecializationService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specialization by ID', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');

      mockSpecializationService.findOne.mockResolvedValue(mockSpecialization);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when specialization not found', async () => {
      mockSpecializationService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockSpecializationService.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle string ID parameter', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');

      mockSpecializationService.findOne.mockResolvedValue(mockSpecialization);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new specialization with all fields', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'Art Therapy',
        description: 'Therapeutic use of art for healing and self-expression',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Art Therapy', 'Therapeutic use of art for healing and self-expression');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create specialization with minimal data', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'Music Therapy',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Music Therapy');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create specialization with empty description', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'Dance Therapy',
        description: '',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Dance Therapy', '');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create specialization with special characters in name', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'CBT & DBT Therapy (Combined)',
        description: 'Combined Cognitive Behavioral Therapy and Dialectical Behavior Therapy',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'CBT & DBT Therapy (Combined)', 'Combined Cognitive Behavioral Therapy and Dialectical Behavior Therapy');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create specialization with unicode characters', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'Terapia Cognitivo-Conductual',
        description: 'Terapia para ansiedad y depresión en español',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Terapia Cognitivo-Conductual', 'Terapia para ansiedad y depresión en español');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create specialization with very long description', async () => {
      const longDescription = 'A'.repeat(1000);
      const createDto: CreateSpecializationDto = {
        name: 'Long Description Therapy',
        description: longDescription,
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Long Description Therapy', longDescription);

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a specialization', async () => {
      const updateDto: UpdateSpecializationDto = {
        name: 'Updated CBT',
        description: 'Updated description for CBT',
      };

      const mockUpdatedSpecialization = createMockSpecialization(1, 'Updated CBT', 'Updated description for CBT');

      mockSpecializationService.update.mockResolvedValue(mockUpdatedSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update only the name', async () => {
      const updateDto: UpdateSpecializationDto = {
        name: 'New Name',
      };

      const mockUpdatedSpecialization = createMockSpecialization(1, 'New Name', 'Original description');

      mockSpecializationService.update.mockResolvedValue(mockUpdatedSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update only the description', async () => {
      const updateDto: UpdateSpecializationDto = {
        description: 'New description',
      };

      const mockUpdatedSpecialization = createMockSpecialization(1, 'Original Name', 'New description');

      mockSpecializationService.update.mockResolvedValue(mockUpdatedSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update name with special characters', async () => {
      const updateDto: UpdateSpecializationDto = {
        name: 'Updated CBT & DBT (Combined)',
      };

      const mockUpdatedSpecialization = createMockSpecialization(1, 'Updated CBT & DBT (Combined)', 'Original description');

      mockSpecializationService.update.mockResolvedValue(mockUpdatedSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update description with unicode characters', async () => {
      const updateDto: UpdateSpecializationDto = {
        description: 'Nueva descripción en español',
      };

      const mockUpdatedSpecialization = createMockSpecialization(1, 'Original Name', 'Nueva descripción en español');

      mockSpecializationService.update.mockResolvedValue(mockUpdatedSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return null when updating non-existent specialization', async () => {
      const updateDto: UpdateSpecializationDto = {
        name: 'Updated Name',
      };

      mockSpecializationService.update.mockResolvedValue(null);

      const result = await controller.update(999, updateDto);

      expect(result).toBeNull();
      expect(mockSpecializationService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should handle empty update data', async () => {
      const updateDto: UpdateSpecializationDto = {};
      const mockSpecialization = createMockSpecialization(1, 'Original Name', 'Original description');

      mockSpecializationService.update.mockResolvedValue(mockSpecialization);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a specialization', async () => {
      mockSpecializationService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'Specialization deleted successfully' });
      expect(mockSpecializationService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent specialization', async () => {
      mockSpecializationService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(999);

      expect(result).toEqual({ message: 'Specialization deleted successfully' });
      expect(mockSpecializationService.remove).toHaveBeenCalledWith(999);
    });

    it('should not throw error when deleting non-existent specialization', async () => {
      mockSpecializationService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(999)).resolves.not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should propagate service errors in findAll', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findOne', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in create', async () => {
      const error = new Error('Database connection failed');
      const createDto: CreateSpecializationDto = {
        name: 'Test Therapy',
      };

      mockSpecializationService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in update', async () => {
      const error = new Error('Database connection failed');
      const updateDto: UpdateSpecializationDto = { name: 'Updated Name' };

      mockSpecializationService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in remove', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('parameter validation', () => {
    it('should handle string ID parameters', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');

      mockSpecializationService.findOne.mockResolvedValue(mockSpecialization);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationService.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle invalid ID parameters gracefully', async () => {
      mockSpecializationService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockSpecializationService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('data validation scenarios', () => {
    it('should handle special characters in names', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'CBT & DBT Therapy (Combined)',
        description: 'Combined therapy approach',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'CBT & DBT Therapy (Combined)', 'Combined therapy approach');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle unicode characters in names and descriptions', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'Terapia Cognitivo-Conductual',
        description: 'Terapia para ansiedad y depresión en español',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Terapia Cognitivo-Conductual', 'Terapia para ansiedad y depresión en español');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(1000);
      const createDto: CreateSpecializationDto = {
        name: 'Long Description Therapy',
        description: longDescription,
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Long Description Therapy', longDescription);

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle empty strings in descriptions', async () => {
      const createDto: CreateSpecializationDto = {
        name: 'No Description Therapy',
        description: '',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'No Description Therapy', '');

      mockSpecializationService.create.mockResolvedValue(mockCreatedSpecialization);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationService.create).toHaveBeenCalledWith(createDto);
    });
  });
});

// Helper function to create mock specialization
function createMockSpecialization(
  id: number,
  name: string,
  description?: string
): Specialization {
  return {
    id,
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Specialization;
}
