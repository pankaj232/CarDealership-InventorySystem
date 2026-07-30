import { JwtTokenService } from '../utils/jwt.token-service';
import { UnauthorizedError } from '../utils/errors';

describe('JwtTokenService', () => {
  const service = new JwtTokenService('test-secret', '1h');

  it('should sign and verify a token', () => {
    const token = service.sign({
      id: '1',
      email: 'user@example.com',
      role: 'user',
    });

    expect(service.verify(token)).toEqual({
      id: '1',
      email: 'user@example.com',
      role: 'user',
    });
  });

  it('should reject an invalid token', () => {
    expect(() => service.verify('not-a-token')).toThrow(UnauthorizedError);
  });

  it('should reject a token signed with a different secret', () => {
    const other = new JwtTokenService('other-secret', '1h');
    const token = other.sign({
      id: '1',
      email: 'user@example.com',
      role: 'admin',
    });

    expect(() => service.verify(token)).toThrow(UnauthorizedError);
  });
});
