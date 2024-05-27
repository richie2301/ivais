import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useMqttStore = create(
    persist(
        (set) => ({
            status: null,
            setStatus: (status: string) => set({ status }),
        }),
        {
            name: 'mqtt-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useMqttStore;