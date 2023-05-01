import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function register(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.status === 200) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });

      alert("User created successfully");
    } else {
      alert("User creation failed");
    }
  }

  if (redirect) {
    navigate("/");
  }

  return (
    <Box>
      <form className="login" onSubmit={register}>
        <Typography mt={"5%"} textAlign={"center"} fontSize={"150%"}>
          Register
        </Typography>
        <TextField
          fullWidth
          margin={"normal"}
          label="Username"
          variant="outlined"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
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
          Register
        </Button>
      </form>
    </Box>
  );
}

export default RegisterPage;
