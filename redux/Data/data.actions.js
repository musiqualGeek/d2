import dataTypes from "./data.types";

export const setOrigin = (origin) => async (dispatch) => {
  try {
    dispatch({
      type: dataTypes.SET_ORIGIN,
      payload: origin,
    });
  } catch (err) {
    console.log("Error setOrigin", err);
  }
};
export const setDestination = (destination) => async (dispatch) => {
  try {
    dispatch({
      type: dataTypes.SET_DESTINATION,
      payload: destination,
    });
  } catch (err) {
    console.log("Error setDestination", err);
  }
};
export const setTravelTime = (travelTime) => async (dispatch) => {
  try {
    dispatch({
      type: dataTypes.SET_TRAVEL_TIME,
      payload: travelTime,
    });
  } catch (err) {
    console.log("Error setTravelTime", err);
  }
};
