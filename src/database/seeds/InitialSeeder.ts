import type { EntityManager } from '@mikro-orm/core';

import { Seeder } from '@mikro-orm/seeder';

import { UserEntity } from '../entities';

export class InitialSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = em.create(UserEntity, {
      email: 'admin@acme.com',
      first_name: 'Admin',
      last_name: 'Acme',
      username: 'admin',
    });

    em.persistAndFlush(user);
  }
}