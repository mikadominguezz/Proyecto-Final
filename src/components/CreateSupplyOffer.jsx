import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Plus, Trash2 } from "lucide-react";

export function CreateSupplyOffer({ serviceId, onClose }) {
  const { state, dispatch } = useApp();
  const [items, setItems] = useState([{ supplyId: "", cantidad: 0 }]);
  const [notas, setNotas] = useState("");

  const mySupplies = state.supplies.filter(s => s.vendedorId === state.currentUser?.id);

  const handleAddItem = () => {
    setItems([...items, { supplyId: "", cantidad: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (!item.supplyId || !item.cantidad) return total;
      const supply = mySupplies.find(s => s.id === item.supplyId);
      return total + (supply ? supply.precioUnit * item.cantidad : 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = items.filter(i => i.supplyId && i.cantidad > 0);

    if (validItems.length === 0) {
      toast.error("Agrega al menos un insumo válido");
      return;
    }

    // Validar stock
    for (const item of validItems) {
      const supply = mySupplies.find(s => s.id === item.supplyId);
      if (supply && item.cantidad > supply.stock) {
        toast.error(`Stock insuficiente para ${supply.nombre}. Disponible: ${supply.stock}`);
        return;
      }
    }

    const newOffer = {
      id: `so${Date.now()}`,
      serviceId,
      vendedorId: state.currentUser.id,
      items: validItems,
      precioTotal: calculateTotal(),
      notas: notas || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_SUPPLY_OFFER", payload: newOffer });
    toast.success("Oferta de insumos enviada exitosamente");
    onClose();
  };

  if (mySupplies.length === 0) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No tienes insumos</DialogTitle>
            <DialogDescription>
              Primero debes agregar insumos a tu catálogo para poder crear ofertas
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Oferta de Insumos</DialogTitle>
          <DialogDescription>
            Selecciona los insumos que ofrecerás para este servicio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {items.map((item, index) => {
              const selectedSupply = mySupplies.find(s => s.id === item.supplyId);
              
              return (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Insumo</Label>
                    <Select
                      value={item.supplyId}
                      onValueChange={(v) => handleItemChange(index, "supplyId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un insumo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mySupplies.map(supply => (
                          <SelectItem key={supply.id} value={supply.id}>
                            {supply.nombre} (${supply.precioUnit}/{supply.unidad}) - Stock: {supply.stock}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-32 space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="0"
                      max={selectedSupply?.stock || 999999}
                      step="0.1"
                      value={item.cantidad || ""}
                      onChange={(e) => handleItemChange(index, "cantidad", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {selectedSupply && (
                    <div className="w-32 text-center pb-2">
                      <div className="text-sm text-muted-foreground">Subtotal</div>
                      <div>${(selectedSupply.precioUnit * item.cantidad).toLocaleString()}</div>
                    </div>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button type="button" variant="outline" onClick={handleAddItem} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Insumo
          </Button>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (Opcional)</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Entrega en 48hs, incluye envío gratis..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span>Precio Total:</span>
            <span className="text-2xl">${calculateTotal().toLocaleString()}</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Enviar Oferta
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
