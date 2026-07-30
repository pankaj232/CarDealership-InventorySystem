import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import jwt from 'jsonwebtoken';
import { RegistrationService } from '../services/registration.service';
import { LoginService } from '../services/login.service';
import { BcryptPasswordHasher } from '../utils/bcrypt.password-hasher';
import { MongooseUserRepository } from '../repositories/user.repository';
import { RegistrationValidator } from '../validators/registration.validator';
import { LoginValidator } from '../validators/login.validator';
import { JwtTokenService } from '../utils/jwt.token-service';
import { InvalidCredentialsError, ValidationError } from '../utils/errors';

describe('LoginService', () => {
  let mongoServer: MongoMemoryServer;
  let loginService: LoginService;
  let registrationService: RegistrationService;

  const jwtSecret = 'test-jwt-secret';

  beforeAll(async () => {
    process.env.JWT_SECRET = jwtSecret;
    mongoServer = await startMemoryMongo();
  }, 120000);

  afterAll(async () => {
    await stopMemoryMongo(mongoServer);
  }, 30000);

  beforeEach(() => {
    const userRepository = new MongooseUserRepository();
    const passwordHasher = new BcryptPasswordHasher();

    registrationService = new RegistrationService(
      userRepository,
      passwordHasher,
      new RegistrationValidator()
    );

    loginService = new LoginService(
      userRepository,
      passwordHasher,
      new JwtTokenService(jwtSecret),
      new LoginValidator()
    );
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  const credentials = {
    email: 'jane@example.com',
    password: 'securePassword123',
  };

  const seedUser = async () => {
    return registrationService.register({
      name: 'Jane Doe',
      ...credentials,
    });
  };

  describe('successful login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const user = await seedUser();

      const result = await loginService.login(credentials);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');

      const payload = jwt.verify(result.token, jwtSecret) as jwt.JwtPayload;
      expect(payload.id).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role);
    });

    it('should accept email case-insensitively', async () => {
      await seedUser();

      const result = await loginService.login({
        ...credentials,
        email: 'Jane@Example.COM',
      });

      expect(result.token).toBeDefined();
    });
  });

  describe('invalid credentials', () => {
    it('should reject when email is not registered', async () => {
      await expect(loginService.login(credentials)).rejects.toBeInstanceOf(
        InvalidCredentialsError
      );
    });

    it('should reject when password is incorrect', async () => {
      await seedUser();

      await expect(
        loginService.login({
          ...credentials,
          password: 'wrongPassword123',
        })
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should use the same error for unknown email and wrong password', async () => {
      await seedUser();

      await expect(
        loginService.login({
          email: 'missing@example.com',
          password: credentials.password,
        })
      ).rejects.toThrow('Invalid email or password');

      await expect(
        loginService.login({
          ...credentials,
          password: 'wrongPassword123',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('input validation', () => {
    it('should reject missing email', async () => {
      await expect(
        loginService.login({
          email: '',
          password: credentials.password,
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject missing password', async () => {
      await expect(
        loginService.login({
          email: credentials.email,
          password: '',
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should include field errors on validation failure', async () => {
      try {
        await loginService.login({ email: '', password: '' });
        fail('expected ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ field: 'email' }),
            expect.objectContaining({ field: 'password' }),
          ])
        );
      }
    });
  });
});
