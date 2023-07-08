import { configureStore } from '@reduxjs/toolkit';
import nodeReducer from '../features/nodeSlice';

const store = configureStore({
  reducer: {
    node: nodeReducer,
  },
  devTools: true,
});

export default store;
