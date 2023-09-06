/**
 * Enum defining the various kinds of comments within a commenting system.
 * This distinction helps in organizing and structuring the flow of conversation.
 */
export enum CommentsTypes {
  /**
   * Refers to an independent, primary comment. This type of comment initiates a conversation
   * or introduces a new topic or perspective. It is not a response to another comment.
   */
  Comment,

  /**
   * Denotes a comment that is directly responding to another comment.
   * Replies contribute to a sub-conversation branching off the main comment.
   */
  Reply,
}
