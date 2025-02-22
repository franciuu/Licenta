import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  return (
    <UserContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
