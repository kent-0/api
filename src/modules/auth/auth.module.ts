import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
