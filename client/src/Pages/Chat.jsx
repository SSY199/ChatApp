import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store/store.js";
import ContactContainers from "./Containers/ContactContainers";
import EmptyChatContainer from "./Containers/EmptyChatContainer";
import ChatContainer from "./Containers/ChatContainer";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please complete your profile setup!");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
   

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">

      {
        isUploading && (<div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {
            fileUploadProgress
          }%
        </div>
      )}
      {
        isDownloading && (<div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {
            fileDownloadProgress
          }%
        </div>
      )}

      <ContactContainers />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
