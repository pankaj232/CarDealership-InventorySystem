import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { RegistrationService } from '../services/registration.service';
import { BcryptPasswordHasher } from '../utils/bcrypt.password-hasher';
import { MongooseUserRepository } from '../repositories/user.repository';
import { RegistrationValidator } from '../validators/registration.validator';
import { DuplicateEmailError, ValidationError } from '../utils/errors';

describe('RegistrationService', () => {
  let mongoServer: MongoMemoryServer;
  let registrationService: RegistrationService;

  beforeAll(async () => {
    mongoServer = await startMemoryMongo();
  }, 120000);

  afterAll(async () => {
    await stopMemoryMongo(mongoServer);
  }, 30000);

  beforeEach(() => {
    registrationService = new RegistrationService(
      new MongooseUserRepository(),
      new BcryptPasswordHasher(),
      new RegistrationValidator()
    );
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  const validInput = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securePassword123',
  };

  describe('successful registration', () => {
    it('should create a user and return it without password', async () => {
      const result = await registrationService.register(validInput);

      expect(result).toMatchObject({
        name: validInput.name,
        email: validInput.email,
        role: 'user',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result).not.toHaveProperty('password');
    });

    it('should persist the user in the database', async () => {
      const result = await registrationService.register(validInput);

      const stored = await User.findById(result.id);
      expect(stored).not.toBeNull();
      expect(stored!.email).toBe(validInput.email);
      expect(stored!.name).toBe(validInput.name);
    });

    it('should hash the password with bcrypt before storing', async () => {
      const result = await registrationService.register(validInput);

      const stored = await User.findById(result.id).select('+password');
      expect(stored).not.toBeNull();
      expect(stored!.password).not.toBe(validInput.password);
      expect(stored!.password.startsWith('$2')).toBe(true);

      const matches = await bcrypt.compare(
        validInput.password,
        stored!.password
      );
      expect(matches).toBe(true);
    });

    it('should normalize email to lowercase', async () => {
      const result = await registrationService.register({
        ...validInput,
        email: 'Jane@Example.COM',
      });

      expect(result.email).toBe('jane@example.com');
    });
  });

  describe('input validation', () => {
    it('should reject missing name', async () => {
      await expect(
        registrationService.register({
          ...validInput,
          name: '',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject missing email', async () => {
      await expect(
        registrationService.register({
          ...validInput,
          email: '',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject invalid email format', async () => {
      await expect(
        registrationService.register({
          ...validInput,
          email: 'not-an-email',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject missing password', async () => {
      await expect(
        registrationService.register({
          ...validInput,
          password: '',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject password shorter than 8 characters', async () => {
      await expect(
        registrationService.register({
          ...validInput,
          password: 'short',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should include field errors on validation failure', async () => {
      try {
        await registrationService.register({
          name: '',
          email: 'bad',
          password: 'short',
        });
        fail('expected ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError.errors.length).toBeGreaterThan(0);
        expect(validationError.errors.every((e) => e.field && e.message)).toBe(
          true
        );
      }
    });
  });

  describe('duplicate email', () => {
    it('should reject registration when email already exists', async () => {
      await registrationService.register(validInput);

      await expect(
        registrationService.register({
          ...validInput,
          name: 'Other User',
        })
      ).rejects.toBeInstanceOf(DuplicateEmailError);
    });

    it('should treat email comparison as case-insensitive', async () => {
      await registrationService.register(validInput);

      await expect(
        registrationService.register({
          ...validInput,
          email: 'JANE@EXAMPLE.COM',
          name: 'Other User',
        })
      ).rejects.toBeInstanceOf(DuplicateEmailError);
    });
  });
});
