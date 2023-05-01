import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

function DeletePost() {
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    deletePost();
  }, []);

  async function deletePost() {
    try {
      const response = await fetch(`http://localhost:4000/deletePost/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!redirect) {
    return <div>Deleting Post...</div>;
  }

  return <Navigate to="/" />;
}

export default DeletePost;
