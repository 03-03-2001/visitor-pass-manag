import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CalendarDays,
  Ticket,
  LogIn,
  Bell,
  BarChart3,
  LogOut,
  UserCircle,
} from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Visitors",
      path: "/visitors",
      icon: Users,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: CalendarDays,
    },
    {
      name: "Passes",
      path: "/passes",
      icon: Ticket,
    },
    {
      name: "Check-In / Check-Out",
      path: "/checkinout",
      icon: LogIn,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

 

  const getNavLinkClass = ({ isActive }) => {
    return `
      flex items-center gap-3 px-4 py-3 rounded-lg
      transition-all duration-200
      ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }
    `;
  };

  return (
    <div className="min-h-screen bg-gray-100">

     

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-white border-r
          transform transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

      

        <div className="h-16 flex items-center justify-between px-5 border-b">

          <div className="flex items-center gap-3">

            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Ticket size={22} />
            </div>

            <div>
              <h1 className="font-bold text-gray-800">
                Visitor Pass
              </h1>

              <p className="text-xs text-gray-500">
                Management System
              </p>
            </div>

          </div>

        

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

        </div>

       

        <nav className="p-4 space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={getNavLinkClass}
              >
                <Icon size={20} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </NavLink>
            );

          })}

        </nav>

       

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />

            <span className="text-sm font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>

    

      <div className="lg:ml-64">

       

        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">

        

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

      

          <div className="hidden sm:block">

            <h2 className="text-lg font-semibold text-gray-800">
              Visitor Pass Management
            </h2>

          </div>

        

          <div className="flex items-center gap-4 ml-auto">

         

            <button
              onClick={() =>
                navigate("/notifications")
              }
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Bell size={21} />

              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

          

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex items-center gap-2"
            >

              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <UserCircle size={22} />
              </div>

              <div className="hidden md:block text-left">

                <p className="text-sm font-semibold text-gray-800">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>

              </div>

            </button>

          </div>

        </header>

       

        <main>
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;