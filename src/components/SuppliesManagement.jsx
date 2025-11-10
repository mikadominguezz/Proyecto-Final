import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

export function SuppliesManagement({ setCurrentView }) {
  const { state, dispatch } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("todas");

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precioUnit, setPrecioUnit] = useState("");
  const [stock, setStock] = useState("");

  const CATEGORIAS_INSUMOS = [
    { value: "quimicos", label: "Químicos" },
    { value: "jardineria", label: "Jardinería" },
    { value: "piscinas", label: "Piscinas" },
    { value: "limpieza", label: "Limpieza" },
    { value: "herramientas", label: "Herramientas" },
    { value: "otros", label: "Otros" }
  ];

  const mySupplies = state.supplies.filter(s => s.vendedorId === state.currentUser?.id);

  const filteredSupplies = mySupplies.filter(supply => {
    if (selectedCategory === "todas") return true;
    return supply.categoria.toLowerCase() === selectedCategory.toLowerCase();
  });

  const resetForm = () => {
    setNombre("");
    setCategoria("");
    setUnidad("");
    setPrecioUnit("");
    setStock("");
    setEditingSupply(null);
  };

  const handleOpenDialog = (supply) => {
    if (supply) {
      setEditingSupply(supply);
      setNombre(supply.nombre);
      setCategoria(supply.categoria);
      setUnidad(supply.unidad);
      setPrecioUnit(supply.precioUnit.toString());
      setStock(supply.stock.toString());
    } else {
      resetForm();
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const precioNum = parseFloat(precioUnit);
    const stockNum = parseInt(stock);

    if (!nombre || !categoria || !unidad) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (!precioNum || precioNum <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (!stockNum || stockNum < 0) {
      toast.error("El stock debe ser 0 o mayor");
      return;
    }

    if (editingSupply) {
      const updatedSupply = {
        ...editingSupply,
        nombre,
        categoria,
        unidad,
        precioUnit: precioNum,
        stock: stockNum,
      };
      dispatch({ type: "UPDATE_SUPPLY", payload: updatedSupply });
      toast.success("Insumo actualizado exitosamente");
    } else {
      const newSupply = {
        id: `sup${Date.now()}`,
        vendedorId: state.currentUser.id,
        nombre,
        categoria,
        unidad,
        precioUnit: precioNum,
        stock: stockNum,
      };
      dispatch({ type: "ADD_SUPPLY", payload: newSupply });
      toast.success("Insumo agregado exitosamente");
    }

    handleCloseDialog();
  };

  const handleDelete = (supplyId) => {
    if (window.confirm("¿Estás seguro de eliminar este insumo?")) {
      dispatch({ type: "DELETE_SUPPLY", payload: supplyId });
      toast.success("Insumo eliminado");
    }
  };

  const getCategoryLabel = (cat) => {
    const category = CATEGORIAS_INSUMOS.find(c => c.value === cat.toLowerCase());
    return category ? category.label : cat;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Insumos</h2>
          <p className="text-muted-foreground">Administra tu catálogo de productos</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Insumo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Insumos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mySupplies.length}</div>
            <p className="text-xs text-muted-foreground">productos en catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ${mySupplies.reduce((sum, s) => sum + (s.precioUnit * s.stock), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">valor del inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Stock Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {mySupplies.reduce((sum, s) => sum + s.stock, 0)}
            </div>
            <p className="text-xs text-muted-foreground">unidades disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Categorías</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {new Set(mySupplies.map(s => s.categoria)).size}
            </div>
            <p className="text-xs text-muted-foreground">categorías únicas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {CATEGORIAS_INSUMOS.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredSupplies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="mb-2">
              {mySupplies.length === 0 ? "No tienes insumos" : "No se encontraron insumos"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {mySupplies.length === 0 
                ? "Agrega tu primer insumo al catálogo" 
                : "Intenta ajustar la búsqueda"}
            </p>
            {mySupplies.length === 0 && (
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Insumo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSupplies.map(supply => (
            <Card key={supply.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="mb-2">{supply.nombre}</h4>
                    <Badge variant="outline">{getCategoryLabel(supply.categoria)}</Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio</span>
                    <span>${supply.precioUnit}/{supply.unidad}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span className={supply.stock < 10 ? "text-red-500" : ""}>
                      {supply.stock} {supply.unidad}
                      {supply.stock < 10 && " (Bajo)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor Total</span>
                    <span>${(supply.precioUnit * supply.stock).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(supply)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(supply.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupply ? "Editar Insumo" : "Agregar Insumo"}</DialogTitle>
            <DialogDescription>
              {editingSupply ? "Modifica los datos del insumo" : "Completa la información del nuevo insumo"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Insumo *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Cloro granulado"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select value={categoria} onValueChange={setCategoria} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_INSUMOS.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad *</Label>
                <Input
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  placeholder="kg, lts, unidad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio por Unidad ($) *</Label>
                <Input
                  id="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioUnit}
                  onChange={(e) => setPrecioUnit(e.target.value)}
                  placeholder="450"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Disponible *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingSupply ? "Actualizar Insumo" : "Agregar Insumo"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
