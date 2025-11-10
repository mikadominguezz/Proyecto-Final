import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Calendar, Package, FileText } from "lucide-react";

// Ciudades de Uruguay
const CIUDADES_URUGUAY = [
  { value: "montevideo", label: "Montevideo" },
  { value: "salto", label: "Salto" },
  { value: "paysandu", label: "Paysandú" },
  { value: "las-piedras", label: "Las Piedras" },
  { value: "rivera", label: "Rivera" },
  { value: "maldonado", label: "Maldonado" },
  { value: "tacuarembo", label: "Tacuarembó" },
  { value: "melo", label: "Melo" },
  { value: "mercedes", label: "Mercedes" },
  { value: "artigas", label: "Artigas" },
  { value: "minas", label: "Minas" },
  { value: "san-jose", label: "San José de Mayo" },
  { value: "durazno", label: "Durazno" },
  { value: "florida", label: "Florida" },
  { value: "canelones", label: "Canelones" },
  { value: "colonia", label: "Colonia del Sacramento" },
  { value: "punta-del-este", label: "Punta del Este" },
  { value: "rocha", label: "Rocha" },
  { value: "treinta-y-tres", label: "Treinta y Tres" }
];

export function ServicesList({ setCurrentView, setSelectedServiceId }) {
  const { state } = useApp();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");

  const getCategoryLabel = (cat) => {
    const labels = {
      jardineria: "Jardinería",
      piscinas: "Piscinas",
      limpieza: "Limpieza",
      otros: "Otros"
    };
    return labels[cat] || cat;
  };

  const getCityLabel = (cityValue) => {
    const ciudad = CIUDADES_URUGUAY.find(c => c.value === cityValue);
    return ciudad ? ciudad.label : cityValue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLICADO": return "bg-blue-500";
      case "EN_EVALUACION": return "bg-yellow-500";
      case "ASIGNADO": return "bg-green-500";
      case "COMPLETADO": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const filteredServices = state.services.filter(service => {
    const matchesCategory = filterCategory === "all" || service.categoria === filterCategory;
    const matchesStatus = filterStatus === "all" || service.estado === filterStatus;
    const matchesCity = filterCity === "all" || service.ciudad === filterCity;

    return matchesCategory && matchesStatus && matchesCity;
  });

  const handleServiceClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setCurrentView("service-detail");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Servicios Disponibles</h2>
          <p className="text-muted-foreground">Explora y gestiona servicios</p>
        </div>
        {state.currentUser?.rol === "SOLICITANTE" && (
          <Button onClick={() => setCurrentView("create-service")}>
            <FileText className="w-4 h-4 mr-2" />
            Publicar Servicio
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busca y filtra servicios según tus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="jardineria">Jardinería</SelectItem>
                <SelectItem value="piscinas">Piscinas</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PUBLICADO">Publicado</SelectItem>
                <SelectItem value="EN_EVALUACION">En Evaluación</SelectItem>
                <SelectItem value="ASIGNADO">Asignado</SelectItem>
                <SelectItem value="COMPLETADO">Completado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {CIUDADES_URUGUAY.map(ciudad => (
                  <SelectItem key={ciudad.value} value={ciudad.value}>
                    {ciudad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="mb-2">No se encontraron servicios</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterCategory !== "all" || filterStatus !== "all" 
                  ? "Intenta ajustar los filtros" 
                  : "No hay servicios disponibles en este momento"}
              </p>
              {state.currentUser?.rol === "SOLICITANTE" && (
                <Button onClick={() => setCurrentView("create-service")}>
                  Publicar Primer Servicio
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredServices.map(service => {
            const quotesCount = state.quotes.filter(q => q.serviceId === service.id).length;
            const offersCount = state.supplyOffers.filter(o => o.serviceId === service.id).length;
            const solicitante = state.users.find(u => u.id === service.solicitanteId);

            return (
              <Card 
                key={service.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{service.titulo}</h3>
                        <Badge className={getStatusColor(service.estado)}>
                          {service.estado.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">{getCategoryLabel(service.categoria)}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{service.descripcion}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{getCityLabel(service.ciudad)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(service.fechaPreferida).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{service.insumosRequeridos.length} insumos requeridos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Publicado por: <strong>{solicitante?.nombre}</strong></span>
                      <span>•</span>
                      <span>{quotesCount} cotizaciones</span>
                      <span>•</span>
                      <span>{offersCount} ofertas de insumos</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {filteredServices.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredServices.length} de {state.services.length} servicios
        </div>
      )}
    </div>
  );
}
