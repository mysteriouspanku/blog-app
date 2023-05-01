import React, { useEffect, useState } from "react";
import Post from "../components/post";

function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/posts").then((response) => {
      response.json().then((posts) => {
        // console.log(posts);
        setPosts(posts);
      });
    });
  }, []);

  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => {
          return <Post key={post.id} {...post} />;
        })}
    </div>
  );
}

export default IndexPage;
