import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Menu, X, Home, MessageCircle, Calculator, Users, 
  Truck, Bell, User, Award, Settings, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const footerItems = [
    { icon: Home, label: "होम", path: "Dashboard", id: "home" },
    { icon: MessageCircle, label: "चैट", path: "Chat", id: "chat" },
    { icon: Calculator, label: "कैलकुलेटर", path: "Calculator", id: "calc" },
    { icon: Users, label: "खरीदार", path: "Buyers", id: "buyers" }
  ];

  const sidebarItems = [
    { icon: Truck, label: "लॉजिस्टिक्स पूलिंग", path: "Logistics", id: "logistics" },
    { icon: Bell, label: "अधिसूचनाएं", path: "Notifications", id: "notifications" },
    { icon: User, label: "मेरा खाता", path: "Account", id: "account" },
    { icon: Users, label: "किसान समूह", path: "FarmerCluster", id: "cluster" },
    { icon: Award, label: "पुरस्कार", path: "Rewards", id: "rewards" },
    { icon: Settings, label: "सेटिंग्स", path: "Settings", id: "settings" }
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-green-50">
                <Menu className="w-6 h-6 text-green-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-green-600 to-green-700 text-white">
              <div className="p-6 border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">किसान Connect</h2>
                    <p className="text-green-100 text-sm">आपका खेती साथी</p>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-green-500/30">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <SheetClose key={item.id} asChild>
                    <Link
                      to={createPageUrl(item.path)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                        currentPath === createPageUrl(item.path)
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-green-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              किसान Connect
            </h1>
          </div>

          <div className="w-10" /> {/* Spacer for symmetry */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-green-100 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {footerItems.map((item) => {
            const isActive = currentPath === createPageUrl(item.path);
            return (
              <Link
                key={item.id}
                to={createPageUrl(item.path)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isActive
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}