import { GET_ERRORS, SET_CURRENT_USER } from "./types";

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login Get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(result => {
      //Save toke to local storage
      const { token } = result.data;
      localStorage.setItem("jwtToken", token);
      //Set token to Auth header
      setAuthToken(token);
      //Decode token to get user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set current User

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  //remove auth headers
  setAuthToken(false);
  //set current user to empty
  dispatch(setCurrentUser({}));
};
