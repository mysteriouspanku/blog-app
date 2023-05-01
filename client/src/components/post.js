import React from "react";
import format from "date-fns/format";
import { Link } from "react-router-dom";

function Post({ _id, coverImage, title, summary, createdAt, author }) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/posts/${_id}`}>
          <img src={"http://localhost:4000/" + coverImage} alt=".." />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/posts/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Post;
