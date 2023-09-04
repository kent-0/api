import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { BoardEntity } from './board.entity';
import { BoardRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing users assigned to boards.
 */
@Entity({
  comment: 'Users assigned to boards.',
  tableName: 'boards_members',
})
export class BoardMembersEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Board to which the user is a member.
   */
  @ManyToOne({
    comment: 'Board to which the user is a member.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * User member roles in the board.
   */
  @ManyToMany(() => BoardRolesEntity, (r) => r.members, {
    comment: 'User member roles in the board.',
    joinColumn: 'role_id',
    owner: true,
  })
  public roles = new Collection<BoardRolesEntity>(this);

  /**
   * User member of the board.
   */
  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
