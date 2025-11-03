import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export function CreateService({ setCurrentView }) {
  const { state, dispatch } = useApp();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("jardineria");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fechaPreferida, setFechaPreferida] = useState("");
  const [insumosRequeridos, setInsumosRequeridos] = useState([
    { nombre: "", cantidad: 0, unidad: "" }
  ]);

  const handleAddInsumo = () => {
    setInsumosRequeridos([...insumosRequeridos, { nombre: "", cantidad: 0, unidad: "" }]);
  };

  const handleRemoveInsumo = (index) => {
    if (insumosRequeridos.length > 1) {
      setInsumosRequeridos(insumosRequeridos.filter((_, i) => i !== index));
    }
  };

  const handleInsumoChange = (index, field, value) => {
    const updated = [...insumosRequeridos];
    updated[index] = { ...updated[index], [field]: value };
    setInsumosRequeridos(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !direccion || !ciudad || !fechaPreferida) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const validInsumos = insumosRequeridos.filter(
      i => i.nombre && i.cantidad > 0 && i.unidad
    );

    if (validInsumos.length === 0) {
      toast.error("Agrega al menos un insumo válido");
      return;
    }

    const newService = {
      id: `s${Date.now()}`,
      solicitanteId: state.currentUser.id,
      titulo,
      descripcion,
      categoria,
      direccion,
      ciudad,
      fechaPreferida,
      insumosRequeridos: validInsumos,
      estado: "PUBLICADO",
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_SERVICE", payload: newService });
    toast.success("Servicio publicado exitosamente");
    setCurrentView("dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("dashboard")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2>Publicar Nuevo Servicio</h2>
          <p className="text-muted-foreground">Completa la información del servicio que necesitas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Servicio</CardTitle>
            <CardDescription>Describe el trabajo que necesitas realizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Servicio *</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Limpieza de jardín y pileta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe en detalle el servicio que necesitas..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select value={categoria} onValueChange={(v) => setCategoria(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jardineria">Jardinería</SelectItem>
                    <SelectItem value="piscinas">Piscinas</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaPreferida">Fecha Preferida *</Label>
                <Input
                  id="fechaPreferida"
                  type="date"
                  value={fechaPreferida}
                  onChange={(e) => setFechaPreferida(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Libertador 1234"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej: Buenos Aires"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Insumos Requeridos</CardTitle>
            <CardDescription>Especifica los materiales que necesitas para el servicio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insumosRequeridos.map((insumo, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Nombre del Insumo</Label>
                  <Input
                    value={insumo.nombre}
                    onChange={(e) => handleInsumoChange(index, "nombre", e.target.value)}
                    placeholder="Ej: Cloro"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={insumo.cantidad || ""}
                    onChange={(e) => handleInsumoChange(index, "cantidad", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Unidad</Label>
                  <Input
                    value={insumo.unidad}
                    onChange={(e) => handleInsumoChange(index, "unidad", e.target.value)}
                    placeholder="kg, lts, unidad"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveInsumo(index)}
                  disabled={insumosRequeridos.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddInsumo} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Insumo
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button type="submit" className="flex-1">
            Publicar Servicio
          </Button>
          <Button type="button" variant="outline" onClick={() => setCurrentView("dashboard")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
