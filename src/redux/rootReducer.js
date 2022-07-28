import chat from '../../screens/Chat/chat-slice';
import {combineReducers} from 'redux';
import userById from './user-slice';

const rootReducer = combineReducers({
  chat,
  userById,
});

export default rootReducer;
