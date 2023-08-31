import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TokensEntity, UserEntity } from '../../database/entities';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [TokensEntity, UserEntity] }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
