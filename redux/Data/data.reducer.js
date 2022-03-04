import dataTypes from "./data.types";

const INITIAL_STATE = {
  origin: null,
  destination: null,
  travelTime: null,
};

const dataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // AUTH
    case dataTypes.SET_ORIGIN:
      return {
        ...state,
        origin: action.payload,
      };
    case dataTypes.SET_DESTINATION:
      return {
        ...state,
        destination: action.payload,
      };
    case dataTypes.SET_TRAVEL_TIME:
      return {
        ...state,
        travelTime: action.payload,
      };
    // DEFAULT
    default:
      return INITIAL_STATE;
  }
};
export default dataReducer;
