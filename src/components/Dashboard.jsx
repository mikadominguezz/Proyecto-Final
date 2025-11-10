import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, ShoppingCart, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";

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

export function Dashboard({ setCurrentView, setSelectedServiceId }) {
  const { state } = useApp();

  const myServices = state.services.filter(s => s.solicitanteId === state.currentUser?.id);
  const myQuotes = state.quotes.filter(q => q.proveedorId === state.currentUser?.id);
  const mySupplies = state.supplies.filter(s => s.vendedorId === state.currentUser?.id);

  const publicServices = state.services.filter(s => s.estado === "PUBLICADO").length;
  const assignedServices = state.services.filter(s => s.estado === "ASIGNADO").length;
  const completedServices = state.services.filter(s => s.estado === "COMPLETADO").length;

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

  if (state.currentUser?.rol === "SOLICITANTE") {
    return (
      <div className="space-y-6">
        <div>
          <h2>Bienvenido, {state.currentUser.nombre}</h2>
          <p className="text-muted-foreground">Gestiona tus solicitudes de servicios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Mis Servicios</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myServices.length}</div>
              <p className="text-xs text-muted-foreground">servicios publicados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Asignados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myServices.filter(s => s.estado === "ASIGNADO").length}</div>
              <p className="text-xs text-muted-foreground">servicios en progreso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Completados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myServices.filter(s => s.estado === "COMPLETADO").length}</div>
              <p className="text-xs text-muted-foreground">servicios finalizados</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView("create-service")}>
            <FileText className="w-4 h-4 mr-2" />
            Publicar Nuevo Servicio
          </Button>
          <Button variant="outline" onClick={() => setCurrentView("services")}>
            Ver Todos los Servicios
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mis Servicios Recientes</CardTitle>
            <CardDescription>Últimos servicios publicados</CardDescription>
          </CardHeader>
          <CardContent>
            {myServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No has publicado servicios aún</p>
                <Button className="mt-4" onClick={() => setCurrentView("create-service")}>
                  Publicar Primer Servicio
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myServices.slice(0, 5).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer" onClick={() => {
                    setSelectedServiceId(service.id);
                    setCurrentView("service-detail");
                  }}>
                    <div className="flex-1">
                      <h4 className="mb-1">{service.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{getCityLabel(service.ciudad)} • {getCategoryLabel(service.categoria)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(service.estado)}>
                        {service.estado.replace("_", " ")}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {state.quotes.filter(q => q.serviceId === service.id).length} cotizaciones
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.currentUser?.rol === "PROVEEDOR_SERVICIO") {
    return (
      <div className="space-y-6">
        <div>
          <h2>Bienvenido, {state.currentUser.nombre}</h2>
          <p className="text-muted-foreground">Gestiona tus cotizaciones y servicios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Servicios Disponibles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{publicServices}</div>
              <p className="text-xs text-muted-foreground">servicios publicados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Mis Cotizaciones</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myQuotes.length}</div>
              <p className="text-xs text-muted-foreground">cotizaciones enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Servicios Ganados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {state.services.filter(s => s.cotizacionSeleccionadaId && myQuotes.some(q => q.id === s.cotizacionSeleccionadaId)).length}
              </div>
              <p className="text-xs text-muted-foreground">cotizaciones aceptadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView("services")}>
            <FileText className="w-4 h-4 mr-2" />
            Ver Servicios Disponibles
          </Button>
          <Button variant="outline" onClick={() => setCurrentView("my-quotes")}>
            Mis Cotizaciones
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Servicios Recientes</CardTitle>
            <CardDescription>Oportunidades para cotizar</CardDescription>
          </CardHeader>
          <CardContent>
            {publicServices === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay servicios disponibles en este momento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.services.filter(s => s.estado === "PUBLICADO").slice(0, 5).map(service => {
                  const hasQuoted = myQuotes.some(q => q.serviceId === service.id);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer" onClick={() => {
                      setSelectedServiceId(service.id);
                      setCurrentView("service-detail");
                    }}>
                      <div className="flex-1">
                        <h4 className="mb-1">{service.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{getCityLabel(service.ciudad)} • {getCategoryLabel(service.categoria)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasQuoted && <Badge variant="outline">Ya cotizado</Badge>}
                        <Badge className={getStatusColor(service.estado)}>
                          {service.estado.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.currentUser?.rol === "PROVEEDOR_INSUMOS") {
    const servicesWithDemand = state.services.filter(
      s => (s.estado === "PUBLICADO" || s.estado === "EN_EVALUACION") && 
      s.insumosRequeridos && 
      s.insumosRequeridos.length > 0
    );

    return (
      <div className="space-y-6">
        <div>
          <h2>Bienvenido, {state.currentUser.nombre}</h2>
          <p className="text-muted-foreground">Gestiona tu catálogo de insumos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Mis Insumos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mySupplies.length}</div>
              <p className="text-xs text-muted-foreground">productos en catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Servicios con Demanda</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{servicesWithDemand.length}</div>
              <p className="text-xs text-muted-foreground">requieren insumos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Ofertas Enviadas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{state.supplyOffers.filter(o => o.vendedorId === state.currentUser?.id).length}</div>
              <p className="text-xs text-muted-foreground">packs ofrecidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Servicios Activos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{publicServices}</div>
              <p className="text-xs text-muted-foreground">totales en el sistema</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView("supply-demand")}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ver Demanda de Insumos
          </Button>
          <Button variant="outline" onClick={() => setCurrentView("supplies")}>
            <Package className="w-4 h-4 mr-2" />
            Gestionar Mi Catálogo
          </Button>
          <Button variant="outline" onClick={() => setCurrentView("services")}>
            Ver Todos los Servicios
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Insumos</CardTitle>
            <CardDescription>Tus productos disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {mySupplies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No has agregado insumos aún</p>
                <Button className="mt-4" onClick={() => setCurrentView("supplies")}>
                  Agregar Primer Insumo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mySupplies.slice(0, 5).map(supply => (
                  <div key={supply.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="mb-1">{supply.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{supply.categoria}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div>${supply.precioUnit}/{supply.unidad}</div>
                        <div className="text-sm text-muted-foreground">Stock: {supply.stock}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
