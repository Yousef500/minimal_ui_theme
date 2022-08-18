import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowed, redirectPath = "/login", children }) => {
    if (allowed) {
        return children ? children : <Outlet />;
    } else {
        return <Navigate to={redirectPath} replace />;
    }
};

export default ProtectedRoute;
