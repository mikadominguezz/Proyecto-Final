import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Star, DollarSign, Clock, CheckCircle, FileText, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";

export function MyQuotes({ setCurrentView, setSelectedServiceId }) {
  const { state, dispatch } = useApp();
  const [editingQuote, setEditingQuote] = useState(null);
  const [editPrecio, setEditPrecio] = useState("");
  const [editPlazoDias, setEditPlazoDias] = useState("");
  const [editDetalle, setEditDetalle] = useState("");
  const [deleteQuoteId, setDeleteQuoteId] = useState(null);

  const myQuotes = state.quotes.filter(q => q.proveedorId === state.currentUser?.id);
  
  const activeQuotes = myQuotes.filter(q => {
    const service = state.services.find(s => s.id === q.serviceId);
    return service && (service.estado === "PUBLICADO" || service.estado === "EN_EVALUACION");
  });

  const completedQuotes = myQuotes.filter(q => {
    const service = state.services.find(s => s.id === q.serviceId);
    return service && (service.estado === "ASIGNADO" || service.estado === "COMPLETADO");
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

  const handleEditClick = (quote) => {
    setEditingQuote(quote);
    setEditPrecio(quote.precio.toString());
    setEditPlazoDias(quote.plazoDias.toString());
    setEditDetalle(quote.detalle || "");
  };

  const handleSaveEdit = () => {
    if (!editPrecio || !editPlazoDias) {
      toast.error("Por favor completa precio y plazo");
      return;
    }

    const precio = parseFloat(editPrecio);
    const plazoDias = parseInt(editPlazoDias);

    if (precio <= 0 || plazoDias <= 0) {
      toast.error("Precio y plazo deben ser mayores a 0");
      return;
    }

    dispatch({
      type: "UPDATE_QUOTE",
      payload: {
        ...editingQuote,
        precio,
        plazoDias,
        detalle: editDetalle
      }
    });

    toast.success("Cotización actualizada exitosamente");
    setEditingQuote(null);
    setEditPrecio("");
    setEditPlazoDias("");
    setEditDetalle("");
  };

  const handleDeleteConfirm = () => {
    if (deleteQuoteId) {
      dispatch({
        type: "DELETE_QUOTE",
        payload: deleteQuoteId
      });
      toast.success("Cotización eliminada exitosamente");
      setDeleteQuoteId(null);
    }
  };

  const canEditOrDelete = (quote) => {
    const service = state.services.find(s => s.id === quote.serviceId);
    return service && (service.estado === "PUBLICADO" || service.estado === "EN_EVALUACION");
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedServiceId(service.id);
                setCurrentView("service-detail");
              }}
            >
              Ver Servicio
            </Button>
            
            {canEditOrDelete(quote) && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditClick(quote)}
                  title="Editar cotización"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteQuoteId(quote.id)}
                  title="Eliminar cotización"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
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
            <CardTitle className="text-sm">Totales</CardTitle>
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
            <CardTitle className="text-sm">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedQuotes.length}</div>
            <p className="text-xs text-muted-foreground">finalizadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="totales">
        <TabsList>
          <TabsTrigger value="totales">Totales ({myQuotes.length})</TabsTrigger>
          <TabsTrigger value="activas">Activas ({activeQuotes.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({completedQuotes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="totales" className="space-y-4">
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

        <TabsContent value="activas" className="space-y-4">
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

        <TabsContent value="completadas" className="space-y-4">
          {completedQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No hay cotizaciones completadas</h3>
                <p className="text-muted-foreground">
                  Las cotizaciones asignadas y finalizadas aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            completedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo de Edición */}
      <Dialog open={!!editingQuote} onOpenChange={() => setEditingQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cotización</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu cotización
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-precio">Precio Total ($) *</Label>
              <Input
                id="edit-precio"
                type="number"
                min="0"
                step="0.01"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                placeholder="Ej: 15000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-plazo">Plazo de Entrega (días) *</Label>
              <Input
                id="edit-plazo"
                type="number"
                min="1"
                value={editPlazoDias}
                onChange={(e) => setEditPlazoDias(e.target.value)}
                placeholder="Ej: 7"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-detalle">Detalle (opcional)</Label>
              <Textarea
                id="edit-detalle"
                value={editDetalle}
                onChange={(e) => setEditDetalle(e.target.value)}
                placeholder="Describe brevemente tu propuesta..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuote(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cotización?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cotización será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
