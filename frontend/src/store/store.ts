import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomReducer from './slices/roomSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomReducer,
        tasks: taskReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
