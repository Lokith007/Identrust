import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../src/components/ui/sidebar"; // Update this path
import { cn } from "./lib/utils"; // Update this path

// Example: adjust this utility if you have one already
const createPageUrl = (name) => `/${name.toLowerCase()}`;

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Wallet", url: "/wallet" },
    { name: "Issue", url: "/issue" },
    { name: "Settings", url: "/settings" },
    { name: "Demos", url: "/demos" },
    { name: "Verify", url: "/verify" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200 bg-white shadow-sm">
          <SidebarHeader className="p-4 font-bold text-xl text-blue-600">
            Base44
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>{item.name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-gray-500">
            © 2025 Base44
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b bg-white">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold text-gray-800">
              Digital Identity
            </h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
