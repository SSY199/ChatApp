import React, { useRef, useEffect } from "react";
import { useAppStore } from "@/store/store.js";
import moment from "moment";
import apiClient from "@/lib/api-client.js";
import { GET_MESSAGES_ROUTES, HOST } from "@/utils/constants.js";
import { MdFolderZip } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessage,
    setSelectedChatMessage,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const scrollRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessages();
    }
  });
  

  const getMessages = async () => {
    try {
      const response = await apiClient.post(
        GET_MESSAGES_ROUTES,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
  
      if (response.data.messages) {
        setSelectedChatMessage(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const isAtBottom = () => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50; // 50px tolerance
  };
  
  useEffect(() => {
    if (isAtBottom() && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const checkIfImage = (filePath) => {
    if (!filePath) return false;
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${url}`, { responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      }
     });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={`my-3 ${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff] text-white rounded-br-none"
              : "bg-[#2a2b33] text-white rounded-bl-none"
          } px-4 py-2 rounded-2xl inline-block max-w-[80%] break-words`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/10 border-[#8417ff]/40"
              : "bg-[#2a2b33]/10 border-[#ffffff]/20"
          } border rounded-2xl my-2 max-w-[70%] inline-block overflow-hidden`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl.replace(/^\/+/, "")}`}
                alt="Message attachment"
                className="rounded-2xl max-w-[250px] max-h-[250px] object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1 py-[1px] rounded-sm opacity-0 group-hover:opacity-100 transition">
                {/* {moment(message.timestamp).format("h:mm A")} */}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className=" bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <FiDownload />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600 mt-1">
        {moment(message.timestamp).format("h:mm A")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    return (
      <div className={`my-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
        <div
          className={`${
            message.sender._id !== userInfo._id
              ? "bg-[#8417ff] text-white rounded-br-none"
              : "bg-[#2a2b33] text-white rounded-bl-none"
          } px-4 py-2 rounded-2xl inline-block max-w-[80%] break-words`}
        >
          {message.content}
        </div>
      )}
      </div>
    )
  }

  const renderMessages = () => {
    if (!selectedChatMessage?.length)
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet
        </div>
      );

    let lastDate = null;
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} className="px-2">
          {showDate && (
            <div className="text-center text-gray-500 text-sm my-4">
              {moment(message.timestamp).format("MMMM D, YYYY")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
          {index === selectedChatMessage.length - 1 && <div ref={scrollRef} />}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 p-4 px-6 md:px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full relative h-full">
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide px-2 pb-4">
        {renderMessages()}
      </div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              alt=""
              className="h-[80vh] w-full bg-cover rounded-3xl"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className=" bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <FiDownload />
            </button>
            <button
              className=" bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;