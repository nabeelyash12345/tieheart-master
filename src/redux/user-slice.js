import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userById: {},
};

const userSlice = createSlice({
  name: 'userById',
  initialState,
  reducers: {
    updateUserInfo(state, {payload}) {
      const {userId, userInfo} = payload;
      state[userId] = userInfo;
    },
  },
});

const userSliceSec = createSlice({
  name: 'userById',
  initialState,
  reducers: {
    updateUserInfoSec(state, {payload}) {
      const {userId, userInfo} = payload;
      state[userId] = userInfo;
    },
  },
});
export const {updateUserInfo} = userSlice.actions;
export const {updateUserInfoSec} = userSliceSec.actions;


export const userById = (store) => (userId) => store.userById[userId];

export default userSlice.reducer;
