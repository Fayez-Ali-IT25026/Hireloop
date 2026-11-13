import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DashbordSidebar from "../components/DashbordSidebar";

const dashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
      <DashbordSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    );
};

export default dashboardLayout;