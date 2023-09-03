/**
 * Enum representing different types of comments and replies.
 */
export enum CommentsTypes {
  /**
   * Represents a top-level comment within the commenting system.
   * These are typically standalone comments that are not in reply to any existing comment.
   */
  Comment,

  /**
   * Represents a reply to an existing comment within the commenting system.
   * Replies are used to respond to specific comments and are usually nested under the comment they are replying to.
   */
  Reply,
}
