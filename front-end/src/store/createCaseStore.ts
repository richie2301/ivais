import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCreateCaseStore = create(
    persist(
        (set) => ({
            data: null,
            setData: (data: string) => set({ data }),
        }),
        {
            name: 'create-case-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useCreateCaseStore;
