import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, email: user.email, name: user.name };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.refreshSignOptions.expiresIn,
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const user = await this.usersService.findOne(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return this.generateToken(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return true;
  }
}
