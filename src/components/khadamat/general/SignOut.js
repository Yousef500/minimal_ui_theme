import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "src/redux/slices/currentUserSlice";

const SignOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setCurrentUser({ modules: [], userInfo: {}, accessibleModules: [] }));
        navigate("/sign-in");
    });
    return <div />;
};

export default SignOut;
