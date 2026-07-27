import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('returns a consistent user identity shape for downstream controllers', async () => {
    const strategy = new JwtStrategy();

    const user = await strategy.validate({
      sub: 'user-123',
      userId: 'user-123',
      email: 'user@example.com',
      role: 'seeker',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: 'user-123',
        userId: 'user-123',
        email: 'user@example.com',
        role: 'seeker',
      }),
    );
  });

  it('preserves companyId when it is present in the token payload', async () => {
    const strategy = new JwtStrategy();

    const user = await strategy.validate({
      sub: 'user-123',
      userId: 'user-123',
      companyId: 'company-456',
      email: 'employer@example.com',
      role: 'employer',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: 'user-123',
        userId: 'user-123',
        companyId: 'company-456',
        email: 'employer@example.com',
        role: 'employer',
      }),
    );
  });
});
