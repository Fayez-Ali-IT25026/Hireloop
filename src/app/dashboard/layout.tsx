import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashbordSidebar from "../components/DashbordSidebar";

const dashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider className="dark">
      <DashbordSidebar />
      <SidebarInset className="bg-[#050505] text-white">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-4">
          <SidebarTrigger className="text-zinc-400 hover:bg-white/10 hover:text-white" />
          <span className="text-sm font-medium text-zinc-500">Dashboard</span>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    );
};

export default dashboardLayout;
