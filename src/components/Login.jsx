import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";

export function Login() {
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
      toast.success(`Bienvenido ${user.nombre}`);
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Marketplace de Servicios</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">Usuarios de prueba:</p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <p><strong>Solicitante:</strong> maria@example.com / 123456</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p><strong>Proveedor Servicio:</strong> jardin@example.com / 123456</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p><strong>Proveedor Insumos:</strong> insumos@example.com / 123456</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
