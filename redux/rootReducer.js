import {combineReducers} from 'redux';

import userReducer from './User/user.reducer';
import dataReducer from './Data/data.reducer';

export default combineReducers({
  user: userReducer,
  data: dataReducer,
});