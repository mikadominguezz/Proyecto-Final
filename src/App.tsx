import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ServicesList } from "./components/ServicesList";
import { ServiceDetail } from "./components/ServiceDetail";
import { CreateService } from "./components/CreateService";
import { MyQuotes } from "./components/MyQuotes";
import { SuppliesManagement } from "./components/SuppliesManagement";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  if (!state.currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <Dashboard
            setCurrentView={setCurrentView}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}

        {currentView === "services" && (
          <ServicesList
            setCurrentView={setCurrentView}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}

        {currentView === "service-detail" && selectedServiceId && (
          <ServiceDetail
            serviceId={selectedServiceId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === "create-service" && (
          <CreateService setCurrentView={setCurrentView} />
        )}

        {currentView === "my-quotes" && (
          <MyQuotes
            setCurrentView={setCurrentView}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}

        {currentView === "supplies" && (
          <SuppliesManagement setCurrentView={setCurrentView} />
        )}
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
