import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecializationService } from '../../src/services/specialization.service';
import { Specialization } from '@/entities/specialization.entity';

describe('SpecializationService', () => {
  let service: SpecializationService;
  let specializationRepository: Repository<Specialization>;

  const mockSpecializationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecializationService,
        {
          provide: getRepositoryToken(Specialization),
          useValue: mockSpecializationRepository,
        },
      ],
    }).compile();

    service = module.get<SpecializationService>(SpecializationService);
    specializationRepository = module.get<Repository<Specialization>>(getRepositoryToken(Specialization));
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

      mockSpecializationRepository.find.mockResolvedValue(mockSpecializations);

      const result = await service.findAll();

      expect(result).toEqual(mockSpecializations);
      expect(mockSpecializationRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no specializations exist', async () => {
      mockSpecializationRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a specialization by ID', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');
      
      mockSpecializationRepository.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.findOne(1);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when specialization not found', async () => {
      mockSpecializationRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a specialization by name', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');
      
      mockSpecializationRepository.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.findByName('Cognitive Behavioral Therapy');

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationRepository.findOne).toHaveBeenCalledWith({ where: { name: 'Cognitive Behavioral Therapy' } });
    });

    it('should return null when specialization not found by name', async () => {
      mockSpecializationRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('Nonexistent Therapy');

      expect(result).toBeNull();
    });

    it('should handle case-sensitive name searches', async () => {
      const mockSpecialization = createMockSpecialization(1, 'Cognitive Behavioral Therapy', 'CBT for anxiety and depression');
      
      mockSpecializationRepository.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.findByName('cognitive behavioral therapy');

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationRepository.findOne).toHaveBeenCalledWith({ where: { name: 'cognitive behavioral therapy' } });
    });
  });

  describe('create', () => {
    it('should create a new specialization with all fields', async () => {
      const specializationData = {
        name: 'Art Therapy',
        description: 'Therapeutic use of art for healing and self-expression',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Art Therapy', 'Therapeutic use of art for healing and self-expression');
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
      expect(mockSpecializationRepository.create).toHaveBeenCalledWith(specializationData);
      expect(mockSpecializationRepository.save).toHaveBeenCalledWith(mockCreatedSpecialization);
    });

    it('should create a specialization with minimal data', async () => {
      const specializationData = {
        name: 'Music Therapy',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Music Therapy');
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
    });

    it('should create a specialization with empty description', async () => {
      const specializationData = {
        name: 'Dance Therapy',
        description: '',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Dance Therapy', '');
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
    });
  });

  describe('update', () => {
    it('should update a specialization', async () => {
      const updateData = { 
        name: 'Updated CBT', 
        description: 'Updated description for CBT' 
      };
      const mockUpdatedSpecialization = createMockSpecialization(1, 'Updated CBT', 'Updated description for CBT');
      
      mockSpecializationRepository.update.mockResolvedValue({ affected: 1 });
      mockSpecializationRepository.findOne.mockResolvedValue(mockUpdatedSpecialization);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockSpecializationRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should update only the name', async () => {
      const updateData = { name: 'New Name' };
      const mockUpdatedSpecialization = createMockSpecialization(1, 'New Name', 'Original description');
      
      mockSpecializationRepository.update.mockResolvedValue({ affected: 1 });
      mockSpecializationRepository.findOne.mockResolvedValue(mockUpdatedSpecialization);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should update only the description', async () => {
      const updateData = { description: 'New description' };
      const mockUpdatedSpecialization = createMockSpecialization(1, 'Original Name', 'New description');
      
      mockSpecializationRepository.update.mockResolvedValue({ affected: 1 });
      mockSpecializationRepository.findOne.mockResolvedValue(mockUpdatedSpecialization);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedSpecialization);
      expect(mockSpecializationRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return null when updating non-existent specialization', async () => {
      const updateData = { name: 'Updated Name' };
      
      mockSpecializationRepository.update.mockResolvedValue({ affected: 0 });
      mockSpecializationRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
    });

    it('should handle empty update data', async () => {
      const updateData = {};
      const mockSpecialization = createMockSpecialization(1, 'Original Name', 'Original description');
      
      mockSpecializationRepository.update.mockResolvedValue({ affected: 1 });
      mockSpecializationRepository.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockSpecialization);
      expect(mockSpecializationRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('remove', () => {
    it('should delete a specialization', async () => {
      mockSpecializationRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockSpecializationRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent specialization', async () => {
      mockSpecializationRepository.delete.mockResolvedValue({ affected: 0 });

      await service.remove(999);

      expect(mockSpecializationRepository.delete).toHaveBeenCalledWith(999);
    });

    it('should not throw error when deleting non-existent specialization', async () => {
      mockSpecializationRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).resolves.not.toThrow();
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle repository errors gracefully in findAll', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationRepository.find.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should handle repository errors gracefully in findOne', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should handle repository errors gracefully in findByName', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationRepository.findOne.mockRejectedValue(error);

      await expect(service.findByName('Test')).rejects.toThrow('Database connection failed');
    });

    it('should handle repository errors gracefully in create', async () => {
      const error = new Error('Database connection failed');
      const specializationData = { name: 'Test Therapy' };
      
      mockSpecializationRepository.create.mockReturnValue({});
      mockSpecializationRepository.save.mockRejectedValue(error);

      await expect(service.create(specializationData)).rejects.toThrow('Database connection failed');
    });

    it('should handle repository errors gracefully in update', async () => {
      const error = new Error('Database connection failed');
      const updateData = { name: 'Updated Name' };
      
      mockSpecializationRepository.update.mockRejectedValue(error);

      await expect(service.update(1, updateData)).rejects.toThrow('Database connection failed');
    });

    it('should handle repository errors gracefully in remove', async () => {
      const error = new Error('Database connection failed');
      mockSpecializationRepository.delete.mockRejectedValue(error);

      await expect(service.remove(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('data validation scenarios', () => {
    it('should handle special characters in specialization name', async () => {
      const specializationData = {
        name: 'CBT & DBT Therapy (Combined)',
        description: 'Combined Cognitive Behavioral Therapy and Dialectical Behavior Therapy',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'CBT & DBT Therapy (Combined)', 'Combined Cognitive Behavioral Therapy and Dialectical Behavior Therapy');
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(1000);
      const specializationData = {
        name: 'Long Description Therapy',
        description: longDescription,
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Long Description Therapy', longDescription);
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
    });

    it('should handle unicode characters in names and descriptions', async () => {
      const specializationData = {
        name: 'Terapia Cognitivo-Conductual',
        description: 'Terapia para ansiedad y depresión en español',
      };

      const mockCreatedSpecialization = createMockSpecialization(1, 'Terapia Cognitivo-Conductual', 'Terapia para ansiedad y depresión en español');
      
      mockSpecializationRepository.create.mockReturnValue(mockCreatedSpecialization);
      mockSpecializationRepository.save.mockResolvedValue(mockCreatedSpecialization);

      const result = await service.create(specializationData);

      expect(result).toEqual(mockCreatedSpecialization);
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
