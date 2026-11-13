"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { DEFAULT_ROLE, isRole, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    {
      id: "seeker-dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-jobs",
      name: "Jobs",
      url: "/dashboard/seeker/jobs",
      icon: Briefcase,
    },
    {
      id: "seeker-saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "seeker-billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: Wallet,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "recruiter-dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-company",
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "recruiter-jobs",
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "recruiter-applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      id: "admin-jobs",
      name: "Jobs",
      url: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      id: "admin-payments",
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: Wallet,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
};

const roleMeta: Record<
  Role,
  {
    portal: string;
    cta: { label: string; url: string; icon: LucideIcon };
  }
> = {
  seeker: {
    portal: "Seeker Portal",
    cta: {
      label: "Post Resume",
      url: "/dashboard/seeker/settings",
      icon: FileText,
    },
  },
  recruiter: {
    portal: "Recruiter Hub",
    cta: {
      label: "Create Job Post",
      url: "/dashboard/recruiter/jobs/new",
      icon: Plus,
    },
  },
  admin: {
    portal: "Admin Console",
    cta: {
      label: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
  },
};

const DashbordSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const role = session?.user?.role;
  const user: Role = isRole(role) ? role : DEFAULT_ROLE; // Default to "seeker" if role is undefined
  const meta = roleMeta[user];

  const name = session?.user?.name ?? "HireLoop User";
  const email = session?.user?.email ?? "";
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HL";

  const isActive = (url: string) =>
    url === `/dashboard/${user}`
      ? pathname === url
      : pathname === url || pathname.startsWith(`${url}/`);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-white/[0.06]",
        "[--sidebar:#08080b] [--sidebar-foreground:#d4d4d8] [--sidebar-accent:#ffffff0f] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:#ffffff14] [--sidebar-ring:#6366f1]"
      )}
    >
      <SidebarHeader className="h-14 shrink-0 justify-center gap-0 border-b border-white/[0.06] px-4 py-0">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-600/30 ring-1 ring-white/20 transition-transform group-hover:scale-105">
            <Briefcase className="size-4 text-white" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base leading-tight font-bold tracking-tight text-white">
              hire<span className="text-indigo-400">loop</span>
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {meta.portal}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <div className="px-3 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white ring-2 ring-white/10">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {email || `${user} account`}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 capitalize">
              {user}
            </span>
          </div>
        </div>

        <SidebarGroup className="px-3 pt-5">
          <SidebarGroupLabel className="h-auto px-1 pb-2 text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {menuItemsByRole[user].map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  isActive={isActive(project.url)}
                  render={<Link href={project.url} />}
                  className={cn(
                    "relative h-10 gap-3 rounded-xl px-3 text-sm font-medium text-zinc-400",
                    "hover:bg-white/[0.06] hover:text-white",
                    "data-active:bg-indigo-500/10 data-active:font-semibold data-active:text-white",
                    "data-active:before:absolute data-active:before:top-1/2 data-active:before:-left-2 data-active:before:h-5 data-active:before:w-1 data-active:before:-translate-y-1/2 data-active:before:rounded-full data-active:before:bg-indigo-500",
                    "data-active:[&>svg]:text-indigo-400"
                  )}
                >
                  <project.icon />
                  <span>{project.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-white/[0.06] p-3">
        <SidebarMenuButton
          render={<Link href={meta.cta.url} />}
          className="h-10 justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:text-white"
        >
          <meta.cta.icon />
          <span>{meta.cta.label}</span>
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={handleSignOut}
          className="h-10 gap-3 rounded-xl px-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashbordSidebar;
