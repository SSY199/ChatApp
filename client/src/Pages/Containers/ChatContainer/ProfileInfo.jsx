import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/store.js";
import { HOST } from "@/utils/constants.js";
import { getColor } from "@/lib/utils.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { toast } from "sonner";
import apiClient from "@/lib/api-client.js";
import { LOGOUT_ROUTE } from "@/utils/constants.js";
import { useState, useRef, useEffect } from "react";
import { FaUserEdit, FaSignOutAlt, FaUserSlash, FaCog } from "react-icons/fa";


//import { Navigate } from "react-router-dom";

const ProfileInfo = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const dropdownRef = useRef();
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (res.status === 200) {
        setUserInfo(null);
        navigate("/auth");
        toast.success("Logged out successfully");
      } else {
        toast.error("Error logging out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await apiClient.delete("/api/auth/delete-account", { withCredentials: true });
      if (res.status === 200) {
        setUserInfo(null);
        navigate("/auth");
        toast.success("Account deleted successfully");
      } else {
        toast.error("Error deleting account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("An error occurred while deleting the account");
    }
  }

  return (
    <div className="h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover h-full w-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-full w-full font-bold text-lg border flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg">
            {userInfo.firstName || userInfo.email}
          </span>
        </div>
      </div>
       <div className="relative" ref={dropdownRef}>
        <FaCog
          className="text-white text-2xl cursor-pointer hover:text-purple-400 transition"
          onClick={() => setOpenSettings(!openSettings)}
        />
        {openSettings && (
          <div className="absolute right-0 bottom-14 w-48 bg-[#1e1f26] rounded shadow-lg z-50 p-2 transition-all duration-200 ease-out">

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center w-full px-3 py-2 text-white hover:bg-[#333] rounded"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-white hover:bg-[#333] rounded"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-[#333] rounded"
            >
              <FaUserSlash className="mr-2" />
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileInfo;
