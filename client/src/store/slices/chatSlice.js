export const createAuthSlice = (set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
});
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMesssage: [],
  directMessagesContacts: [],
  isUploading:false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],


  
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  setIsUploading: (isUploading) => set({
    isUploading
  }),
  setIsDownloading: (isDownloading) => ({
    isDownloading
  }),
  setFileUploadProgress: (fileUploadProgress) => ({
    fileUploadProgress
  }),
  setFileDownloadProgress: (fileDownloadProgress) => ({
    fileDownloadProgress
  }),
  setChannels: (channels) => set({ channels }),


  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMesssage: [],
    });
  },

  addMessage: (message) => {
    const selectedChatMesssage = get().selectedChatMesssage;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMesssage: [
        ...selectedChatMesssage,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel" ? message.sender : message.sender._id,
        },
      ],
    });
  },

  addChannel: (channel) => {
    const channels = get().channels;
    set({channels: [channel, ...channels]});
  },
});