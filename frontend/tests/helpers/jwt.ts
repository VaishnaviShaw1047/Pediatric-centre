/** Minimal JWT the Angular AuthService can decode (`sub` + `exp`). */
export function fakeJwt(userId: number, expiresInSeconds = 60 * 60): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');

  return [
    encode({ alg: 'HS256', typ: 'JWT' }),
    encode({
      sub: String(userId),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
    'test-signature',
  ].join('.');
}
