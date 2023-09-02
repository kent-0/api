import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { BoardEntity } from './board.entity';
import { AuthRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Users assigned to boards.',
  tableName: 'boards_members',
})
export class BoardMembersEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment: 'Board to which the user is a member.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  @ManyToMany(() => AuthRolesEntity, (role) => role.members, {
    comment: 'User member roles in the board.',
    owner: true,
  })
  public roles = new Collection<AuthRolesEntity>(this);

  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
