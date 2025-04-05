import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { APP_GUARD } from '@nestjs/core';
import { GqlJwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
  ],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: jwtConstants.signOptions,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
