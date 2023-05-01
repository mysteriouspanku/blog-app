import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    // console.log("header useEffect.searching for user info");
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((userInfo) => {
        // setUserInfo(userInfo);
        if (userInfo.name === "JsonWebTokenError") {
          setUserInfo(null);
        } else {
          setUserInfo(userInfo);
        }
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <div>
      <header>
        <Link to="/" className="logo">
          My Blog
        </Link>
        <nav>
          {userInfo && (
            <>
              <span>Hello, {username}</span>
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout</a>
            </>
          )}

          {!userInfo && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}

export default Header;
