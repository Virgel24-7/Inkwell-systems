import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { currentUser, setCurrentUser } from "./App";

export const logout = (setUser) => {
  const handleout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("user");
        setCurrentUser(null);
        console.log(auth);
        console.log(currentUser);
        alert("Signed out successfully");

        setUser(null);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  handleout();
};
