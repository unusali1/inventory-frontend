import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Search,ChevronLeft,ChevronRight,AlignJustify} from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";


const Header = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
console.log("user:",user);
  return (
   <header
      className={`bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 fixed top-0 z-30 border-b border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? "w-full" : "w-full sm:w-5/6"
      }`}
    >
      <div className="flex items-center">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <SidebarTrigger />
        </button>
      </div>

      <div className={`flex items-center gap-2 
        ${ isSidebarOpen ? "sm:mr-16 mr-0": "mr-0"}
        `}> 
        <h1 className="text-lg font-bold">{user.username}</h1>
        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="p-1.5 rounded-full"
        >
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};

export default Header;
