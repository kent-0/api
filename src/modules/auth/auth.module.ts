import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserEntity } from 'src/database/entities';
import { TokensEntity } from 'src/database/entities/auth/tokens.entity';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [TokensEntity, UserEntity] }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
