import { Prisma } from '@prisma/client';

export const SortConsts = {
  ASC: Prisma.SortOrder.asc,
  DESC: Prisma.SortOrder.desc,
};
