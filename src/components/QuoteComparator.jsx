import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, Star, Clock, DollarSign, CheckCircle, TrendingDown } from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function QuoteComparator({ serviceId, onBack }) {
  const { state, dispatch } = useApp();
  const [sortBy, setSortBy] = useState("price");
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const service = state.services.find(s => s.id === serviceId);
  const quotes = state.quotes.filter(q => q.serviceId === serviceId);

  if (!service) return null;

  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.precio - b.precio;
      case "time":
        return a.plazoDias - b.plazoDias;
      case "rating":
        return (b.ratingProveedorMock || 0) - (a.ratingProveedorMock || 0);
      default:
        return 0;
    }
  });

  const handleSelectQuote = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setShowConfirmDialog(true);
  };

  const confirmSelection = () => {
    if (!selectedQuoteId) return;

    dispatch({
      type: "SELECT_QUOTE",
      payload: { serviceId, quoteId: selectedQuoteId }
    });

    toast.success("Cotización seleccionada exitosamente");
    setShowConfirmDialog(false);
    onBack();
  };

  const bestPrice = quotes.length > 0 ? Math.min(...quotes.map(q => q.precio)) : 0;
  const bestTime = quotes.length > 0 ? Math.min(...quotes.map(q => q.plazoDias)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2>Comparar Cotizaciones</h2>
          <p className="text-muted-foreground">{service.titulo}</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="mb-2">No hay cotizaciones</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has recibido cotizaciones para este servicio
            </p>
            <Button onClick={onBack}>Volver al Servicio</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>{quotes.length} cotizaciones recibidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Mejor Precio</div>
                    <div className="text-xl">${bestPrice.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Menor Plazo</div>
                    <div className="text-xl">{bestTime} días</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Promedio Rating</div>
                    <div className="text-xl">
                      {(quotes.reduce((sum, q) => sum + (q.ratingProveedorMock || 0), 0) / quotes.length).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cotizaciones</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "price" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("price")}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Precio
                  </Button>
                  <Button
                    variant={sortBy === "time" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("time")}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Plazo
                  </Button>
                  <Button
                    variant={sortBy === "rating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("rating")}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rating
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedQuotes.map((quote, index) => {
                const proveedor = state.users.find(u => u.id === quote.proveedorId);
                const isBestPrice = quote.precio === bestPrice;
                const isBestTime = quote.plazoDias === bestTime;
                
                return (
                  <Card key={quote.id} className="relative">
                    <CardContent className="p-6">
                      {index === 0 && (
                        <Badge className="absolute top-4 right-4 bg-blue-500">
                          Recomendado
                        </Badge>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                          <h4 className="mb-2">{proveedor?.nombre}</h4>
                          {proveedor?.rating && (
                            <div className="flex items-center gap-1 mb-3">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{proveedor.rating}</span>
                              <span className="text-sm text-muted-foreground ml-1">rating</span>
                            </div>
                          )}
                          {quote.detalle && (
                            <p className="text-sm text-muted-foreground">{quote.detalle}</p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Precio Total</div>
                            <div className="text-2xl flex items-center gap-2">
                              ${quote.precio.toLocaleString()}
                              {isBestPrice && (
                                <Badge variant="outline" className="text-xs">
                                  Mejor precio
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Plazo</div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{quote.plazoDias} días</span>
                              {isBestTime && (
                                <Badge variant="outline" className="text-xs">
                                  Más rápido
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Button
                            className="w-full"
                            onClick={() => handleSelectQuote(quote.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Seleccionar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar selección?</AlertDialogTitle>
            <AlertDialogDescription>
              Al seleccionar esta cotización, el servicio pasará a estado "Asignado" y no podrás recibir más cotizaciones.
              ¿Estás seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSelection}>
              Confirmar Selección
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
