import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Me } from 'src/user/decorators/me.decorator';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { Category } from 'src/@generated/objectTypes/category/category.model';
import { CreateCategoryInput } from './inputTypes/create-category.input';
import { UpdateCategoryInput } from './inputTypes/update-category.input';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category)
  category(@Me() user: User, @Args('id') id: string) {
    return this.categoryService.findOne(id, user.id);
  }

  @Query(() => [Category])
  categories(@Me() user: User) {
    return this.categoryService.findAll(user.id);
  }

  @Mutation(() => Category)
  createCategory(@Me() user: User, @Args('data') data: CreateCategoryInput) {
    return this.categoryService.create(data, user.id);
  }

  @Mutation(() => Category)
  updateCategory(
    @Me() user: User,
    @Args('id') id: string,
    @Args('data') data: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, data, user.id);
  }

  @Mutation(() => Category)
  removeCategory(@Me() user: User, @Args('id') id: string) {
    return this.categoryService.remove(id, user.id);
  }
}
