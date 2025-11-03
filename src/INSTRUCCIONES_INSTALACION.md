# 📥 Instrucciones de Instalación - Marketplace de Servicios

## Pasos para usar en Visual Studio Code

### 1. Descargar el Proyecto

Descarga todos los archivos del proyecto y guárdalos en una carpeta en tu computadora. Por ejemplo: `C:\MisProyectos\marketplace-servicios`

### 2. Abrir en Visual Studio Code

1. Abre Visual Studio Code
2. Ve a `Archivo` > `Abrir Carpeta` (o `File` > `Open Folder`)
3. Selecciona la carpeta donde guardaste el proyecto
4. Click en "Seleccionar carpeta"

### 3. Instalar Node.js (si no lo tienes)

Si no tienes Node.js instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Instala siguiendo las instrucciones del instalador
4. Reinicia Visual Studio Code después de instalar

### 4. Abrir Terminal en VS Code

En Visual Studio Code:
- Ve al menú `Terminal` > `Nueva Terminal` (o presiona `` Ctrl + ` ``)
- Se abrirá una terminal en la parte inferior

### 5. Instalar Dependencias

En la terminal que acabas de abrir, escribe:

```bash
npm install
```

Presiona Enter y espera. Esto descargará todas las librerías necesarias (puede tomar 1-3 minutos).

### 6. Iniciar la Aplicación

Una vez que termine la instalación, escribe en la terminal:

```bash
npm start
```

O también puedes usar:

```bash
npm run dev
```

### 7. ¡Listo!

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`

Si no se abre automáticamente, abre tu navegador y ve a: `http://localhost:3000`

---

## 🔧 Comandos Útiles

### Para iniciar el servidor de desarrollo:
```bash
npm start
```
o
```bash
npm run dev
```

### Para detener el servidor:
- En la terminal, presiona `Ctrl + C`
- Confirma con `S` o `Y` cuando pregunte

### Para crear una versión de producción:
```bash
npm run build
```

### Para ver la versión de producción:
```bash
npm run preview
```

---

## ❓ Solución de Problemas Comunes

### Error: "npm no se reconoce como comando"
**Solución**: Necesitas instalar Node.js (ver paso 3)

### Error: "Cannot find module"
**Solución**: 
1. Elimina la carpeta `node_modules` y el archivo `package-lock.json`
2. Ejecuta `npm install` nuevamente

### Error: "Puerto 3000 ya está en uso"
**Solución**: 
1. Cierra cualquier otra aplicación que esté usando el puerto 3000
2. O edita `vite.config.js` y cambia el puerto:
```javascript
server: {
  port: 3001,  // Cambia a otro puerto
  open: true
}
```

### La aplicación no carga o muestra error en el navegador
**Solución**:
1. Verifica que `npm start` se esté ejecutando sin errores en la terminal
2. Refresca el navegador (F5)
3. Prueba en modo incógnito
4. Limpia el caché del navegador

### Cambios en el código no se reflejan
**Solución**:
1. Guarda el archivo (Ctrl + S)
2. Espera unos segundos - Vite recarga automáticamente
3. Si no funciona, detén el servidor (Ctrl + C) y reinícialo con `npm start`

---

## 📁 Estructura de Archivos Importante

```
marketplace-servicios/
├── node_modules/          # NO TOCAR - Librerías instaladas
├── components/            # Componentes de la aplicación
├── context/              # Manejo del estado
├── data/                 # Datos de prueba
├── styles/               # Estilos CSS
├── index.html            # Página HTML principal
├── main.jsx              # Punto de entrada
├── App.jsx               # Componente principal
├── package.json          # Dependencias del proyecto
└── vite.config.js        # Configuración de Vite
```

---

## 💡 Tips

1. **Guarda siempre**: Presiona `Ctrl + S` después de hacer cambios
2. **Hot Reload**: Los cambios se reflejan automáticamente en el navegador
3. **Console del Navegador**: Presiona F12 para ver errores
4. **Terminal de VS Code**: Mantén visible para ver mensajes de error

---

## 🎯 Próximos Pasos

Una vez que la aplicación esté corriendo:

1. Prueba iniciar sesión con los usuarios de prueba
2. Explora las diferentes funcionalidades según el rol
3. Revisa el código en los componentes para entender cómo funciona
4. Experimenta haciendo cambios pequeños

---

## 📞 ¿Necesitas Ayuda?

Si encuentras algún problema:
1. Lee los mensajes de error en la terminal
2. Busca el error en Google
3. Revisa que todos los archivos estén en su lugar
4. Verifica que Node.js esté instalado correctamente: `node --version`

---

¡Disfruta construyendo con React! 🚀
