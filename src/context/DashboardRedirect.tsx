import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext";

interface DashboardRedirectProps {
    children: React.ReactNode;
    user?: string;
    loading?: boolean;
}
export default function DashboardRedirect({ children }: DashboardRedirectProps) {
    const { user, loading } = useContext(AuthContext);
    return (
        <>
            {loading ? null : user ? children : <Navigate to="/login" replace />}
        </>
    );
}