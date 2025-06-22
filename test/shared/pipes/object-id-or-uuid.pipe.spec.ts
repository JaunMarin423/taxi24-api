import { ObjectIdOrUUIDPipe } from '../../../src/shared/pipes/object-id-or-uuid.pipe';

describe('ObjectIdOrUUIDPipe', () => {
  let pipe: ObjectIdOrUUIDPipe;

  beforeEach(() => {
    pipe = new ObjectIdOrUUIDPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('valid ObjectId', () => {
    it('should pass with a valid MongoDB ObjectId', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const result = pipe.transform(validObjectId, { type: 'param' } as any);
      expect(result).toBe(validObjectId);
    });
  });

  describe('valid UUID', () => {
    it('should pass with a valid v4 UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const result = pipe.transform(validUUID, { type: 'param' } as any);
      expect(result).toBe(validUUID);
    });

    it('should pass with a valid v1 UUID', () => {
      const validUUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = pipe.transform(validUUID, { type: 'param' } as any);
      expect(result).toBe(validUUID);
    });
  });

  describe('invalid IDs', () => {
    it('should throw BadRequestException for invalid ObjectId', () => {
      const invalidId = 'not-a-valid-id';
      expect(() => pipe.transform(invalidId, { type: 'param' } as any)).toThrowError(
        'ID no válido. Se espera un ObjectId o UUID',
      );
    });

    it('should throw BadRequestException for invalid UUID', () => {
      const invalidUUID = 'not-a-valid-uuid';
      expect(() => pipe.transform(invalidUUID, { type: 'param' } as any)).toThrowError(
        'ID no válido. Se espera un ObjectId o UUID',
      );
    });

    it('should throw BadRequestException for empty string', () => {
      expect(() => pipe.transform('', { type: 'param' } as any)).toThrowError(
        'ID no válido. Se espera un ObjectId o UUID',
      );
    });
  });
});
