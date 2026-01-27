import { createSlice } from '@reduxjs/toolkit';

interface User {
  user: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    role: 'admin' | 'user' | 'broker' | string; // extend as needed
    accountBalance: number;
    walletAddress: string;
    kycVerified: boolean;
  };
  token: string;
}

interface UserState {
  user: User | null;
}

const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const initialState: UserState = {
  user: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: { payload: User }) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
