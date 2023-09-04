import { Module } from '@nestjs/common';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';

@Module({
  providers: [ProjectService, ProjectResolver],
})
export class ProjectModule {}
