import { create } from "zustand";

export type actionType = "createServer";

interface ServerStore {
    type: actionType | null;
    isOpen: boolean;
    onOpen: (type: actionType) => void;
    onClose: () => void;
}

const useServerStore = create<ServerStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ type, isOpen: true }),
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useServerStore;
