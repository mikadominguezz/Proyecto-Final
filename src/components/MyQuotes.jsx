import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { Star, DollarSign, Clock, CheckCircle, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";

export function MyQuotes({ setCurrentView, setSelectedServiceId }) {
  const { state } = useApp();

  const myQuotes = state.quotes.filter(q => q.proveedorId === state.currentUser?.id);
  
  const activeQuotes = myQuotes.filter(q => {
    const service = state.services.find(s => s.id === q.serviceId);
    return service && (service.estado === "PUBLICADO" || service.estado === "EN_EVALUACION");
  });

  const wonQuotes = myQuotes.filter(q => {
    const service = state.services.find(s => s.id === q.serviceId);
    return service && service.cotizacionSeleccionadaId === q.id;
  });

  const lostQuotes = myQuotes.filter(q => {
    const service = state.services.find(s => s.id === q.serviceId);
    return service && service.cotizacionSeleccionadaId && service.cotizacionSeleccionadaId !== q.id;
  });

  const getCategoryLabel = (cat) => {
    const labels = {
      jardineria: "Jardinería",
      piscinas: "Piscinas",
      limpieza: "Limpieza",
      otros: "Otros"
    };
    return labels[cat] || cat;
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

  const QuoteCard = ({ quote }) => {
    const service = state.services.find(s => s.id === quote.serviceId);
    if (!service) return null;

    const isWon = service.cotizacionSeleccionadaId === quote.id;
    const competingQuotes = state.quotes.filter(q => q.serviceId === service.id).length;

    return (
      <Card className={isWon ? "border-green-500 border-2" : ""}>
        <CardContent className="p-6">
          {isWon && (
            <Badge className="mb-3 bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Cotización Ganada
            </Badge>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="mb-2">{service.titulo}</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={getStatusColor(service.estado)}>
                  {service.estado.replace("_", " ")}
                </Badge>
                <Badge variant="outline">{getCategoryLabel(service.categoria)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{service.ciudad}</p>
              {quote.detalle && (
                <p className="text-sm text-muted-foreground italic">"{quote.detalle}"</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tu Precio</div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>${quote.precio.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Plazo</div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{quote.plazoDias} días</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Competencia</div>
              <div>{competingQuotes} cotizaciones</div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedServiceId(service.id);
              setCurrentView("service-detail");
            }}
          >
            Ver Servicio Completo
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Mis Cotizaciones</h2>
        <p className="text-muted-foreground">Gestiona todas tus cotizaciones enviadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Cotizaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{myQuotes.length}</div>
            <p className="text-xs text-muted-foreground">cotizaciones enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Activas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeQuotes.length}</div>
            <p className="text-xs text-muted-foreground">en evaluación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ganadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{wonQuotes.length}</div>
            <p className="text-xs text-muted-foreground">cotizaciones aceptadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Activas ({activeQuotes.length})</TabsTrigger>
          <TabsTrigger value="won">Ganadas ({wonQuotes.length})</TabsTrigger>
          <TabsTrigger value="lost">Perdidas ({lostQuotes.length})</TabsTrigger>
          <TabsTrigger value="all">Todas ({myQuotes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No hay cotizaciones activas</h3>
                <p className="text-muted-foreground mb-4">
                  Revisa los servicios disponibles para enviar nuevas cotizaciones
                </p>
                <Button onClick={() => setCurrentView("services")}>
                  Ver Servicios Disponibles
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          {wonQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">Aún no has ganado cotizaciones</h3>
                <p className="text-muted-foreground">
                  Sigue enviando cotizaciones competitivas para ganar proyectos
                </p>
              </CardContent>
            </Card>
          ) : (
            wonQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </TabsContent>

        <TabsContent value="lost" className="space-y-4">
          {lostQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No hay cotizaciones perdidas</p>
              </CardContent>
            </Card>
          ) : (
            lostQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {myQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No has enviado cotizaciones</h3>
                <p className="text-muted-foreground mb-4">
                  Explora los servicios disponibles y empieza a cotizar
                </p>
                <Button onClick={() => setCurrentView("services")}>
                  Ver Servicios Disponibles
                </Button>
              </CardContent>
            </Card>
          ) : (
            myQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
