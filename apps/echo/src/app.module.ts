import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ConfigSchema } from './common/schemas';
import { PersistenceModule } from './persistence/persistence.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

// TODO: investigate spotify api
//       - start with Web API API
//       - then proceed to Web Playback SDK
// TODO: continue here...
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config: Record<string, unknown>) => ConfigSchema.parse(config),
    }),
    PersistenceModule.register(),

    AuthModule,
    TodosModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
