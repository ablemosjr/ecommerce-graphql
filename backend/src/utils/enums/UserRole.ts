import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
