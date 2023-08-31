import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from '@mikro-orm/core';

import { UserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';
import { RolesEntity } from './roles.entity';

@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
  @ManyToOne({
    comment:
      'Creator of the board. When the user is deleted, the associated dashboard is also deleted.',
    entity: () => UserEntity,
    onDelete: 'cascade',
  })
  public created_by: Rel<UserEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the board.',
    length: 100,
  })
  public name: string;

  @OneToMany(() => RolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board',
  })
  public roles = new Collection<RolesEntity>(this);
}
