import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '@/types';

interface RoomState {
    rooms: Room[];
    loading: boolean;
    error: string | null;
}

const initialState: RoomState = {
    rooms: [],
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
            state.error = null;
        },
        addRoom: (state, action: PayloadAction<Room>) => {
            state.rooms.push(action.payload);
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setLoading, setRooms, addRoom, setError } = roomSlice.actions;
export default roomSlice.reducer;
