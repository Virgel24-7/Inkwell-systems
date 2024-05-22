import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { logOut } from "./Loginbox";
import { setCurrentUser } from "./UserPage";

export const logout = (handleLogout) => {
  const handleout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser(null);
        logOut();
        handleLogout();
        alert("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  handleout();
};
