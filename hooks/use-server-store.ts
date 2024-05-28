import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type actionType = "createServer" | "editServer" | "leaveServer" | "deleteServer" | "invitePeople" | "manageMembers" | "createChannel" ;

interface ModalData {
    server?: Server
    channelType?: ChannelType;
}
interface ServerStore {
    type: actionType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: actionType, data?: ModalData, channelType?: ChannelType) => void;
    onClose: () => void;
}

const useServerStore = create<ServerStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useServerStore;
