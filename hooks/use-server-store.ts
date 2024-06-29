import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type actionType = "createServer" | "editServer" | "leaveServer" | "deleteServer" | "invitePeople" | "manageMembers" | "createChannel" | "editChannel" | "deleteChannel" | "messageFile" | "deleteMessage";

interface ModalData {
    server?: Server
    channel?: Channel
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}
interface ServerStore {
    type: actionType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: actionType, data?: ModalData) => void;
    onClose: () => void;
}

const useServerStore = create<ServerStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => {
        console.log(type, data);
        set({ type, data, isOpen: true });
    },
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useServerStore;
