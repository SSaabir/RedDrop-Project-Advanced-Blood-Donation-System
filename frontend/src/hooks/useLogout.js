import { useAuthContext } from "./useAuthContext";
import { useSecondAuth } from "./useSecondAuth";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { secondUser, logout: secondLogout } = useSecondAuth();
    const navigate = useNavigate();

    const logout = () => {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });

        if (localStorage.getItem("secondUser") || secondUser) {
            localStorage.removeItem("secondUser");
            secondLogout();
            navigate("/");
        }
        
        navigate("/");
    };

    return { logout };
};
