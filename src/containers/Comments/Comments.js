import React from "react";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import AddComment from "./AddComment/AddComment";
import Comment from "./Comment/Comment";

const Comments = (props) => {
  return (
    <div>
      <CommentsHeader amountComments={props.amountComments} />
      <AddComment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default Comments;
