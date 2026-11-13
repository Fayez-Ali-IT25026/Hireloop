import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client";

import type { LucideIcon } from "lucide-react";

interface MenuItem {
    id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}


const menuItemsByRole: Record<string, MenuItem[]> ={
  seeker: [],
    recruiter: [],
    admin: [],
};



const DashbordSidebar = () => {


      const { data: session, isPending } =
        authClient.useSession();
    
      const user = session?.user?.role || "seeker"; // Default to "seeker" if role is undefined


    return (
            <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />

<SidebarGroup>
  <SidebarMenu>
  {menuItemsByRole[user].map((project) => (
    <SidebarMenuItem key={project.id}>
      <SidebarMenuButton render={<a href={project.url} />}>
        <project.icon />
        <span>{project.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
</SidebarGroup>

      </SidebarContent>
      <SidebarFooter />
    </Sidebar>

    );
};

export default DashbordSidebar;