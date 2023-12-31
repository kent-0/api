import { Field, ID, ObjectType } from '@nestjs/graphql';

import { CommentsTypes } from '~/database/enums/comments.enum';
import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

/**
 * The `minimalProperties` constant defines a list of basic properties that are essential for representing
 * a minimalistic version of a board task comment. This is helpful for scenarios where we only need a subset
 * of the board task comment's full details.
 *
 * The use of the `tuple` function (presumably a utility function) ensures that the properties are organized
 * into a tuple format, ensuring a fixed size and order of elements.
 *
 * Additionally, the `createFieldPaths` function is used to generate paths for nested properties within
 * the board task comment, especially for properties that are related to the author's details.
 */
const minimalProperties = tuple(
  'content',
  'type',
  ...createFieldPaths('author', ...AuthUserMinimalProperties),
);

/**
 * The `BoardTaskCommentMinimalProperties` constant extends the base `minimalProperties` by adding nested properties.
 * These nested properties are essential for representing more detailed relationships within the board task comment,
 * such as the author's details and the relationship to replies and the comment to which a reply might be made.
 *
 * Essentially, this constant provides a comprehensive list of properties that give a more detailed view of
 * a board task comment without providing the complete details.
 */
export const BoardTaskCommentMinimalProperties = tuple(
  ...minimalProperties,
  ...createFieldPaths('author', ...AuthUserMinimalProperties),
  ...createFieldPaths('reply_to', ...minimalProperties),
  ...createFieldPaths('replies', ...minimalProperties),
);

/**
 * `BoardTaskCommentObject` Object Type:
 * This object type represents the structure of a comment object associated with a task on a board.
 * It provides details about the author, content, any replies to the comment, and potentially a reference
 * to another comment if this is a reply itself. Additionally, it specifies the type of comment (e.g., Comment or Reply).
 */
@ObjectType({
  description:
    'Object representing a comment associated with a task on a board.',
})
export class BoardTaskCommentMinimalObject {
  /**
   * Represents the author of the comment. This provides details about the user who made the comment.
   */
  @Field(() => ID, {
    description: 'The author of the comment.',
  })
  public author!: AuthUserMinimalObject;

  /**
   * The content or text of the comment.
   */
  @Field({
    description: 'The content of the comment.',
  })
  public content!: string;

  /**
   * A list of replies associated with this comment. Each reply is also represented as a `BoardTaskCommentObject`.
   */
  @Field(() => [BoardTaskCommentMinimalObject], {
    description: 'A list of replies associated with this comment.',
  })
  public replies!: BoardTaskCommentMinimalObject[];

  /**
   * If this comment object is a reply, this field references the original comment it is replying to.
   */
  @Field(() => BoardTaskCommentMinimalObject, {
    description: 'The comment to which this comment is replying.',
    nullable: true,
  })
  public reply_to?: BoardTaskCommentMinimalObject;

  /**
   * Specifies the type of this comment, for example, whether it's a primary comment or a reply.
   */
  @Field(() => CommentsTypes, {
    description:
      'Whether the comment is a general comment or a reply to a comment.',
  })
  public type!: CommentsTypes;
}
