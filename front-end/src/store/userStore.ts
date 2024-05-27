import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
            userID: null,
            setUserID: (userID: string) => set({ userID }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useUserStore;
