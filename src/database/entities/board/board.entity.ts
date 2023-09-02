import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardMembersEntity } from './members.entity';
import { AuthRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment:
      'Creator of the board. When the user is deleted, the associated dashboard is also deleted.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  @OneToMany(() => BoardMembersEntity, (m) => m.board, {
    comment: 'Users assigned to the board.',
  })
  public members = new Collection<BoardMembersEntity>(this);

  @Property({
    columnType: 'varchar',
    comment: 'Name of the board.',
    length: 100,
  })
  public name!: string;

  @OneToMany(() => AuthRolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board.',
  })
  public roles = new Collection<AuthRolesEntity>(this);
}
