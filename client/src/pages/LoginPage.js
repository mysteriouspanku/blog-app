import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(event) {
    // Prevent the browser from refreshing the page
    // when the form is submitted (default behavior)
    event.preventDefault();
    const respose = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),

      // We need to tell the server that we are sending JSON
      // and that we want JSON back in return
      headers: { "Content-Type": "application/json" },

      // This is the important part
      // We need to tell the browser to send the cookie
      // along with the request
      // This is called "credentials: include"
      credentials: "include",
    });
    if (respose.status === 200) {
      respose.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Box>
      <form className="login" onSubmit={login} autoComplete="off">
        <Typography mt={"5%"} textAlign={"center"} fontSize={"150%"}>
          Login
        </Typography>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          autoFocus
        />
        <TextField
          fullWidth
          margin={"normal"}
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
          sx={{ mt: 3 }}
        >
          Login
        </Button>
      </form>
    </Box>
    // <div width={"50%"} mx="auto" borderRadius={"20px"}>
    //   <form className="login" onSubmit={login}>
    //     <h1 mt={"5%"} textAlign={"center"} fontSize="5xl">
    //       Login
    //     </h1>
    //     <input
    //       m={"5px"}
    //       placeholder="username"
    //       value={username}
    //       onChange={(ev) => setUsername(ev.target.value)}
    //     />
    //     <input
    //       placeholder="password"
    //       m={"5px"}
    //       type="password"
    //       value={password}
    //       onChange={(ev) => setPassword(ev.target.value)}
    //     />
    //     <button m={"5px"} mb={"10%"} colorScheme="teal" size="md" type="submit">
    //       Login
    //     </button>
    //   </form>
    // </div>
  );
}

export default LoginPage;
