import React from "react";
import { useAppStore } from "@/store/store.js";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils.js";
import { HOST } from "@/utils/constants.js";
import { Trash2 } from "lucide-react"; // using Lucide icon
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";

const ContactList = ({ contacts, isChannel }) => {
  const {
    setSelectedChatType,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatMessage,
    userInfo,
    removeChannel, // assuming you have this in store
  } = useAppStore();

  const handleContactClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };

  const deleteChannel = async (channelId) => {
    try {
      const res = await apiClient.delete(`/api/channels/delete-channel/${channelId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        removeChannel(channelId); // or manually filter it out if not in store
        if (selectedChatData && selectedChatData._id === channelId) {
          setSelectedChatData(null);
        }
      }
    } catch (err) {
      console.error("Error deleting channel:", err);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          className={`group flex items-center justify-between px-4 py-2 cursor-pointer transition-all duration-300 ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleContactClick(contact)}
          key={contact._id}
        >
          <div className="flex gap-4 items-center text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover h-full w-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 font-bold text-lg border flex items-center justify-center rounded-full ${getColor(
                      contact.color || "gray"
                    )}`}
                  >
                    {contact.firstName?.charAt(0) || contact.email?.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] w-10 h-10 rounded-full flex items-center justify-center text-white text-lg">
                #
              </div>
            )}
            <span>
              {isChannel
                ? contact.name
                : contact.firstName
                ? `${contact.firstName} ${contact.lastName}`
                : contact.email}
            </span>
          </div>

          {isChannel && userInfo?._id === contact.admin && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation(); // prevent selecting chat on delete click
                deleteChannel(contact._id);
              }}
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
