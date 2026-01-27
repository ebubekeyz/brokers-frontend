// src/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
// src/hooks/useUpdateAccountBalance.ts
import { useEffect } from "react";

import axios from "axios";

// Typed useDispatch
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

// Typed useSelector without using TypedUseSelectorHook
export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return useSelector(selector);
};




export const useUpdateAccountBalance = () => {
  const token = useAppSelector((state) => state.userState.user?.token); // token from userState

  const productionUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:7000/api'
    : 'https://brokers-backend-hbq6.onrender.com/api';

  useEffect(() => {
    const updateBalance = async () => {
      if (!token) return;

      try {
        // 1. Get the user profile to get ID
        const meRes = await axios.get(
          `${productionUrl}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userId = meRes.data?.user?._id;
        if (!userId) return;

        // 2. Get the current account balance
        const balanceRes = await axios.get(
          `${productionUrl}/auth/account/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

       
        const accountBalance = balanceRes.data?.balance;
        if (accountBalance === undefined) return;

        // 3. Update the account balance in the user's profile
        await axios.put(
          `${productionUrl}/auth/${userId}`,
          { accountBalance },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

      } catch (error) {
        console.error("❌ Failed to update account balance:", error);
      }
    };

    updateBalance();
  }, [token]);
};
