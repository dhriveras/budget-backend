import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { CreateUserInput } from 'src/users/inputTypes/create-user.input';
import { UsersService } from 'src/users/users.service';
import { GqlLocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Token } from './objectTypes/token.type';
import { Public } from './decorators/public.decorator';
import { Me } from 'src/users/decorators/me.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Mutation(() => User)
  singup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Public()
  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => Token)
  login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() req: any,
  ) {
    return this.authService.login(req.req.user);
  }

  @Public()
  @Mutation(() => Token)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => Boolean)
  logout(@Me() { id }: User) {
    return this.authService.logout(id);
  }
}
