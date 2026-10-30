
import { useState } from "react";
import {
  FiGrid,
  FiPlus,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiMenu,
  FiX,
  FiShield,
  
} from "react-icons/fi";

import DashboardHome from "./DashboardHome";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import AllUsers from "./AllUsers";
import AdminOrders from "./AdminOrders";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: FiGrid },
    { name: "Create Product", icon: FiPlus },
    { name: "All Products", icon: FiPackage },
    { name: "All Users", icon: FiUsers },
    { name: "Orders", icon: FiShoppingBag },
    { name: "Settings", icon: FiSettings },
   
  ];

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardHome />;

      case "Create Product":
        return (
          <CreateProduct
            onProductCreated={() => setActivePage("All Products")}
            onCancel={() => setActivePage("All Products")}
          />
        );

      case "All Products":
        return <AllProducts />;

      case "All Users":
        return <AllUsers />;

      case "Orders":
        return <AdminOrders />;

      case "Contact":
        return <Contact />;

      case "Settings":
        return (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3eee5] text-[#8c7650]">
              <FiSettings size={28} />
            </div>

            <h2 className="text-2xl font-bold">Settings</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Admin settings yahan add karenge.
            </p>
          </div>
        );

      default:
        return <DashboardHome />;
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#f7f7f5] text-[#191919]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#191919] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-[100px] items-center justify-between border-b border-white/10 px-6">
          <div>
            <h2 className="text-xl font-bold tracking-[0.12em]">
              THE SHOE SPOT
            </h2>

            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#c5ae86]">
              Store Administration
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="mx-4 mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c5ae86] text-[#191919]">
            <FiShield size={21} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Administrator</p>
            <p className="mt-1 text-xs text-gray-400">
              Management Panel
            </p>
          </div>
        </div>

        <div className="px-5 pb-3 pt-8">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => handleNavigation(item.name)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "translate-x-1 bg-[#c5ae86] text-[#191919] shadow-[0_8px_20px_rgba(197,174,134,0.18)]"
                    : "text-gray-400 hover:translate-x-1 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#191919]" />
                )}

                <Icon
                  size={19}
                  className={`shrink-0 transition-transform duration-300 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`}
                />

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#191919]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="rounded-xl bg-white/[0.04] p-4">
            <p className="text-xs font-semibold text-white">
              The Shoe Spot
            </p>

            <p className="mt-1 text-[11px] text-gray-500">
              Admin Dashboard
            </p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[270px]">
        <header className="sticky top-0 z-30 flex min-h-[82px] items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#191919] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c5ae86] hover:shadow-md lg:hidden"
              aria-label="Open navigation menu"
            >
              <FiMenu size={21} />
            </button>

            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b825d] sm:block">
                The Shoe Spot / Admin
              </p>

              <h1 className="truncate text-xl font-bold tracking-tight sm:mt-1 sm:text-2xl">
                {activePage}
              </h1>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="mt-1 text-xs text-gray-500">
                Store Management
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfd1] bg-[#f3eee5] text-[#806944]">
              <FiShield size={19} />
            </div>
          </div>
        </header>

        <section className="min-h-[calc(100vh-82px)] p-4 sm:p-6 lg:p-8">
          <div
            key={activePage}
            className="animate-[adminFadeIn_0.35s_ease-out]"
          >
            {renderPage()}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes adminFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
