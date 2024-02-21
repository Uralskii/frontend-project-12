import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: { messages: null },
  reducers: {
    getMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { getMessages } = messageSlice.actions;
export default messageSlice.reducer;