export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60s' },
  refreshSignOptions: { expiresIn: '7d' },
};
