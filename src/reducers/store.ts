import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import taskSlice from './taskSlice';
import thunkMiddleware from 'redux-thunk';

export const store = configureStore({
  reducer: {
    task: taskSlice,
  },
  middleware: [
    thunkMiddleware,
    ...getDefaultMiddleware({serializableCheck: false}),
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
