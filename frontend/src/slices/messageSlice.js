import axios from 'axios';
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import routes from '../routes.js';
import getAuthHeader from '../utilities/getAuthHeader.js';
import { removeChannel } from './channelSlice.js';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await axios.get(routes.messagesPath(), { headers: getAuthHeader() });
    return response.data;
  },
);

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({ status: 'idle', error: null }),
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;

        const allMessages = Object.values(state.entities);
        const restMessages = allMessages.filter((m) => m.channelId !== channelId);

        messagesAdapter.setAll(state, restMessages);
      })
      .addCase(fetchMessages.fulfilled, messagesAdapter.addMany);
  },
});

export const { addMessage } = messagesSlice.actions;
export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
