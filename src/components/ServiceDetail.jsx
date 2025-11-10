import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, MapPin, Calendar, Package, DollarSign, Clock, Star } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { CreateQuote } from "./CreateQuote.jsx";
import { CreateSupplyOffer } from "./CreateSupplyOffer.jsx";
import { QuoteComparator } from "./QuoteComparator.jsx";

export function ServiceDetail({ serviceId, setCurrentView }) {
  const { state, dispatch } = useApp();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const service = state.services.find(s => s.id === serviceId);
  const quotes = state.quotes.filter(q => q.serviceId === serviceId);
  const supplyOffers = state.supplyOffers.filter(o => o.serviceId === serviceId);
  const solicitante = state.users.find(u => u.id === service?.solicitanteId);

  if (!service) {
    return (
      <div className="text-center py-12">
        <h3>Servicio no encontrado</h3>
        <Button className="mt-4" onClick={() => setCurrentView("services")}>
          Volver a Servicios
        </Button>
      </div>
    );
  }

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

  const myQuote = quotes.find(q => q.proveedorId === state.currentUser?.id);
  const canQuote = state.currentUser?.rol === "PROVEEDOR_SERVICIO" && 
                   (service.estado === "PUBLICADO" || service.estado === "EN_EVALUACION");

  const canOffer = state.currentUser?.rol === "PROVEEDOR_INSUMOS" && 
                   (service.estado === "PUBLICADO" || service.estado === "EN_EVALUACION");

  const isOwner = state.currentUser?.id === service.solicitanteId;

  const handleChangeStatus = (newStatus) => {
    if (newStatus === "COMPLETADO" && !service.providerRating) {
      // Si se marca como completado y aún no hay rating, mostrar diálogo
      setShowRatingDialog(true);
    } else {
      dispatch({
        type: "UPDATE_SERVICE",
        payload: { ...service, estado: newStatus }
      });
    }
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    const selectedQuote = state.quotes.find(q => q.id === service.cotizacionSeleccionadaId);
    
    if (selectedQuote) {
      dispatch({
        type: "RATE_PROVIDER",
        payload: {
          serviceId: service.id,
          providerId: selectedQuote.proveedorId,
          rating: rating
        }
      });

      dispatch({
        type: "UPDATE_SERVICE",
        payload: { ...service, estado: "COMPLETADO", providerRating: rating, ratingComment }
      });

      toast.success("Servicio completado y proveedor calificado");
      setShowRatingDialog(false);
      setRating(0);
      setRatingComment("");
    }
  };

  if (showComparator) {
    return (
      <QuoteComparator
        serviceId={serviceId}
        onBack={() => setShowComparator(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("services")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2>{service.titulo}</h2>
            <Badge className={getStatusColor(service.estado)}>
              {service.estado.replace("_", " ")}
            </Badge>
            <Badge variant="outline">{getCategoryLabel(service.categoria)}</Badge>
          </div>
          <p className="text-muted-foreground">Publicado por {solicitante?.nombre}</p>
        </div>
        {isOwner && quotes.length > 0 && service.estado !== "ASIGNADO" && service.estado !== "COMPLETADO" && (
          <Button onClick={() => setShowComparator(true)}>
            {quotes.length === 1 ? "Ver Cotización" : "Comparar Cotizaciones"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{service.descripcion}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Ubicación</div>
                    <div>{service.direccion}, {service.ciudad}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Fecha Preferida</div>
                    <div>{new Date(service.fechaPreferida).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insumos Requeridos</CardTitle>
              <CardDescription>{service.insumosRequeridos.length} insumos necesarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {service.insumosRequeridos.map((insumo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{insumo.nombre}</span>
                    </div>
                    <Badge variant="outline">
                      {insumo.cantidad} {insumo.unidad}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isOwner && service.estado !== "COMPLETADO" && (
            <Card>
              <CardHeader>
                <CardTitle>Gestionar Estado</CardTitle>
                <CardDescription>Actualiza el estado de tu servicio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {service.estado === "PUBLICADO" && (
                    <Button onClick={() => handleChangeStatus("EN_EVALUACION")} variant="outline">
                      Marcar como En Evaluación
                    </Button>
                  )}
                  {service.estado === "ASIGNADO" && (
                    <Button onClick={() => handleChangeStatus("COMPLETADO")}>
                      Marcar como Completado
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {service.estado === "COMPLETADO" && service.providerRating && (
            <Card>
              <CardHeader>
                <CardTitle>Calificación del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Tu calificación</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= service.providerRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-lg font-medium ml-2">
                      {service.providerRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                {service.ratingComment && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Tu comentario</div>
                    <p className="text-sm">{service.ratingComment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cotizaciones</span>
                <Badge>{quotes.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ofertas de Insumos</span>
                <Badge>{supplyOffers.length}</Badge>
              </div>
              {quotes.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Precio Mínimo</span>
                    <span>${Math.min(...quotes.map(q => q.precio)).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plazo Mínimo</span>
                    <span>{Math.min(...quotes.map(q => q.plazoDias))} días</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {canQuote && !myQuote && (
            <Card>
              <CardHeader>
                <CardTitle>Enviar Cotización</CardTitle>
                <CardDescription>Ofrece tu servicio a este cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setShowQuoteForm(true)}>
                  Cotizar Servicio
                </Button>
              </CardContent>
            </Card>
          )}

          {myQuote && (
            <Card>
              <CardHeader>
                <CardTitle>Tu Cotización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <span>${myQuote.precio.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plazo</span>
                  <span>{myQuote.plazoDias} días</span>
                </div>
                {myQuote.detalle && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{myQuote.detalle}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {canOffer && (
            <Card>
              <CardHeader>
                <CardTitle>Ofrecer Insumos</CardTitle>
                <CardDescription>Crea un paquete de insumos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setShowOfferForm(true)}>
                  Crear Oferta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">Cotizaciones ({quotes.length})</TabsTrigger>
          <TabsTrigger value="supplies">Ofertas de Insumos ({supplyOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hay cotizaciones aún</p>
              </CardContent>
            </Card>
          ) : (
            quotes.map(quote => {
              const proveedor = state.users.find(u => u.id === quote.proveedorId);
              const isSelected = service.cotizacionSeleccionadaId === quote.id;
              
              return (
                <Card key={quote.id} className={isSelected ? "border-green-500 border-2" : ""}>
                  <CardContent className="p-6">
                    {isSelected && (
                      <Badge className="mb-3 bg-green-500">Cotización Seleccionada</Badge>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="mb-1">{proveedor?.nombre}</h4>
                        {proveedor?.rating && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{proveedor.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">${quote.precio.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{quote.plazoDias} días</div>
                      </div>
                    </div>
                    {quote.detalle && (
                      <p className="text-sm text-muted-foreground">{quote.detalle}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="supplies" className="space-y-4">
          {supplyOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hay ofertas de insumos aún</p>
              </CardContent>
            </Card>
          ) : (
            supplyOffers.map(offer => {
              const vendedor = state.users.find(u => u.id === offer.vendedorId);
              
              return (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="mb-1">{vendedor?.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{offer.items.length} insumos incluidos</p>
                      </div>
                      <div className="text-2xl">${offer.precioTotal.toLocaleString()}</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {offer.items.map((item, idx) => {
                        const supply = state.supplies.find(s => s.id === item.supplyId);
                        return supply ? (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{supply.nombre}</span>
                            <span className="text-muted-foreground">
                              {item.cantidad} {supply.unidad}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    {offer.notas && (
                      <p className="text-sm text-muted-foreground border-t pt-3">{offer.notas}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {showQuoteForm && (
        <CreateQuote
          serviceId={serviceId}
          onClose={() => setShowQuoteForm(false)}
        />
      )}

      {showOfferForm && (
        <CreateSupplyOffer
          serviceId={serviceId}
          onClose={() => setShowOfferForm(false)}
        />
      )}

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calificar Proveedor</DialogTitle>
            <DialogDescription>
              El servicio ha sido completado. Por favor califica al proveedor de servicio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Calificación *</Label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {rating} de 5 estrellas
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comentario (opcional)</Label>
              <Textarea
                id="comment"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Comparte tu experiencia con este proveedor..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRatingDialog(false);
                setRating(0);
                setRatingComment("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitRating}>
              Completar y Calificar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
