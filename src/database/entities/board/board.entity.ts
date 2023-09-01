import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';
import { BoardMembersEntity } from './members.entity';
import { BoardRolesEntity } from './roles.entity';

@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
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

  @OneToMany(() => BoardRolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board.',
  })
  public roles = new Collection<BoardRolesEntity>(this);
}
