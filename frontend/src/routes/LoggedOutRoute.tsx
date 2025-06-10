import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoggedOutRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/" />;
    }
    return <>{children}</>;
}