import { useApp } from "../context/AppContext.jsx";
import { Button } from "./ui/button";
import { LogOut, User, Home, Package, FileText, ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";

export function Navbar({ currentView, setCurrentView }) {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case "SOLICITANTE":
        return "bg-blue-500";
      case "PROVEEDOR_SERVICIO":
        return "bg-green-500";
      case "PROVEEDOR_INSUMOS":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl">Marketplace de Servicios</h1>
            
            <div className="flex gap-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Button>
              
              <Button
                variant={currentView === "services" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("services")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Servicios
              </Button>

              {state.currentUser?.rol === "PROVEEDOR_SERVICIO" && (
                <Button
                  variant={currentView === "my-quotes" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("my-quotes")}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Mis Cotizaciones
                </Button>
              )}

              {state.currentUser?.rol === "PROVEEDOR_INSUMOS" && (
                <Button
                  variant={currentView === "supplies" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("supplies")}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Mis Insumos
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{state.currentUser?.nombre}</span>
              <Badge className={getRoleColor(state.currentUser?.rol || "")}>
                {state.currentUser?.rol.replace("_", " ")}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
