import { createContext, useState } from "react";

// This is the context that will be used to store the user object.
// The user object will be stored in the context provider.
export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({ message: "hi" });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
