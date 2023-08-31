import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Rel,
} from '@mikro-orm/core';

import { UserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';
import { BoardEntity } from './board.entity';
import { BoardRolesEntity } from './roles.entity';

@Entity({
  comment: 'Users assigned to boards.',
  tableName: 'boards_members',
})
export class BoardMembersEntity extends ParentEntity {
  @ManyToOne({
    comment: 'Board to which the user is a member.',
    entity: () => BoardEntity,
  })
  public board: Rel<BoardEntity>;

  @ManyToMany({
    comment: 'User member roles in the board.',
    entity: () => BoardRolesEntity,
  })
  public roles = new Collection<BoardRolesEntity>(this);

  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => UserEntity,
  })
  public user: Rel<UserEntity>;
}
