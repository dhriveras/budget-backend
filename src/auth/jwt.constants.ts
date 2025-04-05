export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '30m' },
  refreshSignOptions: { expiresIn: '7d' },
};
