import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { load_UserProfile } from "../../actions/userAction";
import CricketBallLoader from "../layouts/loader/Loader";
import Login from "../User/Login";
function PrivateRoute({ isAdmin, component: Component, ...rest }) {
  const { loading, isAuthenticated, user, isAdminAuthenticated } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(load_UserProfile());
  // }, [dispatch]);

  console.log(isAuthenticated, user);

  if (loading) {
    return <CricketBallLoader />;
  }

  // If the user data failed to load or the user is not authenticated, redirect to the login page
  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  // If isAdmin is true and the user is not an admin, redirect to the login page
  // if (isAdmin && user.role !== "admin") {
  //   return <Redirect to="/login" />;
  // }
  // if (!isAuthenticated || !user) {
  // }
  if (!isAdminAuthenticated) {
    return <Login />;
  }

  // If the user is authenticated and isAdmin check is passed, render the specified component
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default PrivateRoute;
