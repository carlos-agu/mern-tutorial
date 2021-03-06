import axios from "axios";
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from "./types";

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export function setProfileLoading() {
  return {
    type: PROFILE_LOADING
  };
}

export function clearCurrentProfile() {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
}
