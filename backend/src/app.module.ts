import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as bodyParser from 'body-parser';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { DatabaseType } from './utils/enums/DatabaseType';
import { ProductModule } from './products/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { Product } from './products/entities/product.entity';
import { Category } from './category/entities/category.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schemas/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as DatabaseType,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Product, Category, Order, OrderItem],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.raw({ type: 'application/json' }))
      .forRoutes('payment/webhook');
  }
}
