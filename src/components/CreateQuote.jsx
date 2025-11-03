import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

export function CreateQuote({ serviceId, onClose }) {
  const { state, dispatch } = useApp();
  const [precio, setPrecio] = useState("");
  const [plazoDias, setPlazoDias] = useState("");
  const [detalle, setDetalle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const precioNum = parseFloat(precio);
    const plazoNum = parseInt(plazoDias);

    if (!precioNum || precioNum <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (!plazoNum || plazoNum <= 0) {
      toast.error("El plazo debe ser mayor a 0");
      return;
    }

    const newQuote = {
      id: `q${Date.now()}`,
      serviceId,
      proveedorId: state.currentUser.id,
      precio: precioNum,
      plazoDias: plazoNum,
      detalle: detalle || undefined,
      ratingProveedorMock: state.currentUser?.rating,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_QUOTE", payload: newQuote });
    toast.success("Cotización enviada exitosamente");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Cotización</DialogTitle>
          <DialogDescription>
            Completa los detalles de tu cotización para este servicio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="precio">Precio Total ($) *</Label>
            <Input
              id="precio"
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="15000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plazo">Plazo de Ejecución (días) *</Label>
            <Input
              id="plazo"
              type="number"
              min="1"
              value={plazoDias}
              onChange={(e) => setPlazoDias(e.target.value)}
              placeholder="5"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detalle">Detalles de la Cotización</Label>
            <Textarea
              id="detalle"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Incluye mano de obra, herramientas, garantía..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Enviar Cotización
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
