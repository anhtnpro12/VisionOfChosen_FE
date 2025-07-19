'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, LogOut, Shield, User, FileSearch, Settings, Home } from "lucide-react"
import Link from "next/link"
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayloadCustom {
  email?: string;
  user_email?: string;
  sub?: string;
  [key: string]: any; // Cho phép các trường khác nếu có
}

const menuItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Scan Reports",
    url: "/dashboard/reports",
    icon: FileSearch,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

function getEmailFromToken() {
  try {
    const token = Cookies.get('access_token');
    if (!token) return null;
    const decoded = jwtDecode<JwtPayloadCustom>(token);
    // Thử lấy email từ các trường phổ biến
    return decoded.name || null;
  } catch {
    return null;
  }
}

export function AppSidebar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }
    try {
      const email = getEmailFromToken();
      if (!email) {
        window.location.href = '/auth/login';
        return;
      }
      setUserEmail(email);
    } catch {
      window.location.href = '/auth/login';
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/auth/login';
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="p-2 bg-muted rounded-lg">
            <Image
              src="/logo-transparent.png"
              alt="Shield Icon"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Terraform</h2>
            <p className="text-sm text-muted-foreground">Destroy Drift</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-semibold text-sm">
                {userEmail?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="ml-2">{userEmail || "Chưa đăng nhập"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
