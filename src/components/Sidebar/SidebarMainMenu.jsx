import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Layers, Box, Tags, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const SidebarMainMenu = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/kanban-board", label: "Kanban Board", icon: Layers },
    { href: "/products", label: "All Products", icon: Box },
    { href: "/category", label: "Categories", icon: Tags },
  ];

  const handleLogout = () => {
    console.log("logout");
    logout();
  };

  return (
    <Sidebar collapsible="icon"  className="flex flex-col h-screen w-64 bg-white border-r shadow-sm">
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <div className="px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">
              Inventory Mangement
            </h1>
          </div>

          <SidebarMenu className="px-2 mt-8 space-y-4">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild className="h-10">
                    <Link
                      to={href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                        ${
                          isActive
                            ? "bg-blue-100 text-blue-700 font-semibold "
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        <div className="p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  className="flex items-center justify-center w-full px-4 py-6 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMainMenu;
