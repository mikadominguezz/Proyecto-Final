import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export function SupplyDemand({ setCurrentView }) {
  const { state, dispatch } = useApp();
  const [selectedService, setSelectedService] = useState(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [offerNotes, setOfferNotes] = useState("");

  // Servicios publicados con insumos requeridos
  const servicesWithDemand = state.services.filter(
    s => (s.estado === "PUBLICADO" || s.estado === "EN_EVALUACION") && 
    s.insumosRequeridos && 
    s.insumosRequeridos.length > 0
  );

  // Mis insumos disponibles
  const mySupplies = state.supplies.filter(s => s.vendedorId === state.currentUser?.id);

  // Mis ofertas enviadas
  const myOffers = state.supplyOffers.filter(o => o.vendedorId === state.currentUser?.id);

  // Agrupar demanda por insumo
  const demandSummary = servicesWithDemand.reduce((acc, service) => {
    service.insumosRequeridos.forEach(insumo => {
      const key = insumo.nombre.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          nombre: insumo.nombre,
          totalCantidad: 0,
          unidad: insumo.unidad,
          servicios: [],
        };
      }
      acc[key].totalCantidad += insumo.cantidad;
      acc[key].servicios.push({
        id: service.id,
        titulo: service.titulo,
        cantidad: insumo.cantidad,
      });
    });
    return acc;
  }, {});

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
      default: return "bg-gray-500";
    }
  };

  const handleOpenOfferDialog = (service) => {
    setSelectedService(service);
    
    // Pre-seleccionar insumos que coincidan con la demanda
    const preSelected = service.insumosRequeridos.map(req => {
      const matchingSupply = mySupplies.find(s => 
        s.nombre.toLowerCase().includes(req.nombre.toLowerCase()) ||
        req.nombre.toLowerCase().includes(s.nombre.toLowerCase())
      );
      
      return {
        insumoRequerido: req,
        supplyId: matchingSupply?.id || "",
        cantidad: req.cantidad,
        esEquivalente: false,
        notasEquivalencia: "",
      };
    });
    
    setSelectedSupplies(preSelected);
    setOfferNotes("");
    setShowOfferDialog(true);
  };

  const handleSupplyChange = (index, field, value) => {
    const updated = [...selectedSupplies];
    updated[index] = { ...updated[index], [field]: value };
    
    // Si cambia el supply, marcar como equivalente si no es exacto
    if (field === "supplyId") {
      const supply = mySupplies.find(s => s.id === value);
      const required = updated[index].insumoRequerido;
      const isExactMatch = supply && 
        supply.nombre.toLowerCase() === required.nombre.toLowerCase();
      updated[index].esEquivalente = !isExactMatch && value !== "";
    }
    
    setSelectedSupplies(updated);
  };

  const calculateTotal = () => {
    return selectedSupplies.reduce((total, item) => {
      if (!item.supplyId) return total;
      const supply = mySupplies.find(s => s.id === item.supplyId);
      return total + (supply ? supply.precioUnit * item.cantidad : 0);
    }, 0);
  };

  const handleSubmitOffer = () => {
    // Validar que todos los insumos tengan un supply seleccionado
    const incomplete = selectedSupplies.some(item => !item.supplyId);
    if (incomplete) {
      toast.error("Por favor selecciona un insumo para cada requerimiento");
      return;
    }

    // Validar que haya stock suficiente
    const insufficientStock = selectedSupplies.find(item => {
      const supply = mySupplies.find(s => s.id === item.supplyId);
      return supply && supply.stock < item.cantidad;
    });

    if (insufficientStock) {
      toast.error("No tienes stock suficiente para algunos insumos");
      return;
    }

    // Validar que si es equivalente, tenga notas
    const equivalentWithoutNotes = selectedSupplies.find(
      item => item.esEquivalente && !item.notasEquivalencia
    );

    if (equivalentWithoutNotes) {
      toast.error("Por favor agrega notas explicativas para los productos equivalentes");
      return;
    }

    const newOffer = {
      id: `so${Date.now()}`,
      serviceId: selectedService.id,
      vendedorId: state.currentUser.id,
      items: selectedSupplies.map(item => ({
        supplyId: item.supplyId,
        cantidad: item.cantidad,
        insumoRequeridoNombre: item.insumoRequerido.nombre,
        esEquivalente: item.esEquivalente,
        notasEquivalencia: item.notasEquivalencia,
      })),
      precioTotal: calculateTotal(),
      notas: offerNotes,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_SUPPLY_OFFER", payload: newOffer });
    toast.success("Oferta de insumos enviada exitosamente");
    setShowOfferDialog(false);
    setSelectedService(null);
    setSelectedSupplies([]);
    setOfferNotes("");
  };

  const hasOfferedToService = (serviceId) => {
    return myOffers.some(o => o.serviceId === serviceId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Demanda de Insumos</h2>
        <p className="text-muted-foreground">Analiza la demanda y propón tus productos</p>
      </div>

      <Tabs defaultValue="demand">
        <TabsList>
          <TabsTrigger value="demand">
            <TrendingUp className="w-4 h-4 mr-2" />
            Demanda ({Object.keys(demandSummary).length})
          </TabsTrigger>
          <TabsTrigger value="services">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Servicios ({servicesWithDemand.length})
          </TabsTrigger>
          <TabsTrigger value="my-offers">
            <Package className="w-4 h-4 mr-2" />
            Mis Ofertas ({myOffers.length})
          </TabsTrigger>
        </TabsList>

        {/* Resumen de Demanda */}
        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Demanda</CardTitle>
              <CardDescription>
                Insumos más solicitados en servicios activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(demandSummary).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay demanda de insumos en este momento
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(demandSummary).map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{item.nombre}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.servicios.length} servicio(s) lo requieren
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {item.totalCantidad} {item.unidad}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Desglose por servicio:</p>
                        {item.servicios.map(srv => (
                          <div key={srv.id} className="flex justify-between text-sm pl-4">
                            <span className="text-muted-foreground">{srv.titulo}</span>
                            <span>{srv.cantidad} {item.unidad}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sugerir mis productos equivalentes */}
                      {mySupplies.filter(s => 
                        s.nombre.toLowerCase().includes(item.nombre.toLowerCase()) ||
                        item.nombre.toLowerCase().includes(s.nombre.toLowerCase())
                      ).length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-green-600 mb-2">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            Tienes productos relacionados:
                          </p>
                          {mySupplies
                            .filter(s => 
                              s.nombre.toLowerCase().includes(item.nombre.toLowerCase()) ||
                              item.nombre.toLowerCase().includes(s.nombre.toLowerCase())
                            )
                            .map(supply => (
                              <div key={supply.id} className="text-sm pl-6 text-muted-foreground">
                                • {supply.nombre} - Stock: {supply.stock} {supply.unidad}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Servicios con Demanda */}
        <TabsContent value="services" className="space-y-4">
          {servicesWithDemand.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No hay servicios con demanda de insumos</h3>
                <p className="text-muted-foreground">
                  Cuando los solicitantes publiquen servicios con insumos requeridos, aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            servicesWithDemand.map(service => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="mb-2">{service.titulo}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(service.estado)}>
                          {service.estado.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">{getCategoryLabel(service.categoria)}</Badge>
                        <Badge variant="outline">{service.ciudad}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium mb-2">Insumos Requeridos:</p>
                    <div className="space-y-2">
                      {service.insumosRequeridos.map((insumo, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{insumo.nombre}</span>
                          <span className="font-medium">
                            {insumo.cantidad} {insumo.unidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {hasOfferedToService(service.id) ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Ya enviaste una oferta para este servicio
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleOpenOfferDialog(service)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Proponer Insumos
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Mis Ofertas */}
        <TabsContent value="my-offers" className="space-y-4">
          {myOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No has enviado ofertas</h3>
                <p className="text-muted-foreground">
                  Revisa los servicios disponibles y propón tus insumos
                </p>
              </CardContent>
            </Card>
          ) : (
            myOffers.map(offer => {
              const service = state.services.find(s => s.id === offer.serviceId);
              if (!service) return null;

              return (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h4 className="mb-2">{service.titulo}</h4>
                      <Badge className={getStatusColor(service.estado)}>
                        {service.estado.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <p className="text-sm font-medium">Insumos Propuestos:</p>
                      {offer.items.map((item, idx) => {
                        const supply = state.supplies.find(s => s.id === item.supplyId);
                        if (!supply) return null;

                        return (
                          <div key={idx} className="border rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium">{supply.nombre}</p>
                                {item.esEquivalente && (
                                  <Badge variant="outline" className="mt-1">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Equivalente a: {item.insumoRequeridoNombre}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm font-medium">
                                {item.cantidad} {supply.unidad}
                              </span>
                            </div>
                            {item.notasEquivalencia && (
                              <p className="text-sm text-muted-foreground italic mt-2">
                                "{item.notasEquivalencia}"
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              ${supply.precioUnit}/{supply.unidad} × {item.cantidad} = ${(supply.precioUnit * item.cantidad).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Precio Total:</span>
                        <span className="text-xl font-bold text-primary">
                          ${offer.precioTotal.toLocaleString()}
                        </span>
                      </div>
                      {offer.notas && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Notas:</strong> {offer.notas}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Enviada: {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para crear oferta */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proponer Insumos</DialogTitle>
            <DialogDescription>
              {selectedService?.titulo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedSupplies.map((item, index) => {
              const supply = mySupplies.find(s => s.id === item.supplyId);
              
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {item.insumoRequerido.nombre}
                    </Label>
                    <Badge variant="secondary">
                      Necesita: {item.insumoRequerido.cantidad} {item.insumoRequerido.unidad}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`supply-${index}`}>Tu Producto *</Label>
                    <select
                      id={`supply-${index}`}
                      className="w-full p-2 border rounded-md"
                      value={item.supplyId}
                      onChange={(e) => handleSupplyChange(index, "supplyId", e.target.value)}
                    >
                      <option value="">Selecciona un producto</option>
                      {mySupplies.map(supply => (
                        <option key={supply.id} value={supply.id}>
                          {supply.nombre} - Stock: {supply.stock} {supply.unidad} - ${supply.precioUnit}/{supply.unidad}
                        </option>
                      ))}
                    </select>
                  </div>

                  {item.esEquivalente && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Este producto es equivalente. Explica por qué es una buena alternativa:
                        </p>
                      </div>
                      <Textarea
                        placeholder="Ej: Mismo principio activo, mayor concentración..."
                        value={item.notasEquivalencia}
                        onChange={(e) => handleSupplyChange(index, "notasEquivalencia", e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cantidad-${index}`}>Cantidad *</Label>
                      <Input
                        id={`cantidad-${index}`}
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleSupplyChange(index, "cantidad", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    {supply && (
                      <div className="space-y-2">
                        <Label>Subtotal</Label>
                        <div className="p-2 bg-muted rounded-md font-semibold">
                          ${(supply.precioUnit * item.cantidad).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {supply && supply.stock < item.cantidad && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Stock insuficiente (disponible: {supply.stock})
                    </div>
                  )}
                </div>
              );
            })}

            <div className="space-y-2">
              <Label htmlFor="notas">Notas Adicionales (opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Tiempo de entrega, condiciones especiales, descuentos..."
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Precio Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitOffer}>
              Enviar Oferta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
