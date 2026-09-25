# Práctica de Laboratorio: Optimización de Modelos de Datos con GraphQL y DataLoader

Este repositorio contiene el código base para la práctica de la **Unidad 3: Diseño de APIs** en la Maestría de Ingeniería de Software (Materia: *Patrones de Diseño de Software*).

## 🎯 Objetivo de la Práctica
El propósito de este laboratorio es diseñar e implementar un contrato de API utilizando **GraphQL (Schema-First Design)** e identificar y resolver un problema crítico de rendimiento en sistemas distribuidos: el **Problema de Consulta N+1**.

Al finalizar el laboratorio, habrás aprendido a:
1. Traducir modelos de datos jerárquicos a un esquema de tipos estricto (SDL).
2. Diagnosticar cuellos de botella en la capa de datos analizando los logs de ejecución.
3. Implementar el patrón de diseño **DataLoader** en Node.js para agrupar peticiones por lotes (*batching*) y manejar caché por ciclo de vida de petición (*per-request caching*).

---

## ✅ Solución Implementada

> Explicación completa, capturas y análisis en **[REPORTE.md](REPORTE.md)**.

**Resultado:** la query del dashboard pasa de **6 consultas** (N+1) a **2 consultas** con DataLoader.

### Estructura
| Archivo | Contenido |
|---|---|
| `schema.graphql` | Contrato SDL: `Cliente`, `Factura`, `enum EstadoFactura` y `Query.clientes` |
| `database.js` | Mock DB con 5 clientes; incluye `fetchFacturasByClienteIdsBatch` |
| `resolvers.naive.js` | Solución **ingenua**: una consulta de facturas por cliente (N+1) |
| `resolvers.js` | Solución **optimizada**: `Cliente.facturas` usa `loaders.facturasPorCliente.load()` |
| `dataloaders.js` | Batch Function + fábrica `createLoaders()` |
| `server.js` | Carga el esquema, elige resolvers y crea los loaders **por petición** en `context` |

### Ejecución
```bash
npm install
npm start               # versión optimizada (DataLoader) → 2 consultas
npm run start:ingenuo   # versión ingenua (N+1)           → 6 consultas
```
Abrir `http://localhost:4000/`, ejecutar la query `GetDashboardData` y revisar la consola.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu entorno local:
* **Node.js** (Versión 18.0.0 o superior)
* Un cliente HTTP para pruebas (como [Postman](https://postman.com) o la misma interfaz integrada de Apollo Sandbox).

---

## 🚀 Instrucciones de Configuración Inicial

Sigue estos pasos para inicializar el proyecto en tu máquina local:

### 1. Inicializar el Proyecto de Node.js
Si deseas construir el entorno desde cero, crea un directorio ejecútalo en tu terminal:
```bash
npm init -y
```

### 2. Configurar Soporte para Módulos de ECMAScript (ES Modules)
Abre el archivo `package.json` generado y asegúrate de añadir la propiedad `"type": "module"` para permitir el uso nativo de `import/export`:
```json
{
  "name": "laboratorio-graphql-dataloader",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "dependencies": {}
}
```

### 3. Instalar las Dependencias Core
Instala las librerías necesarias para levantar el servidor y aplicar la optimización:
```bash
npm install @apollo/server graphql dataloader
```

### 4. Crear el Servidor Base
Crea un archivo llamado `server.js` y pega el código base proporcionado por el docente en la guía de la práctica.

### 5. Ejecutar el Servidor
Inicia la aplicación ejecutando:
```bash
node server.js
```
Deberías ver en tu consola el siguiente mensaje:
`🚀 Servidor Académico listo en: http://localhost:4000/`

---

## 🔍 Guía de Ejecución y Diagnóstico (El Reto Técnico)

### Fase 1: Reproducir el Problema N+1 (Estado Ingenuo)
1. Abre tu navegador e ingresa a `http://localhost:4000/` para abrir el entorno de pruebas de **Apollo Sandbox**.
2. Ejecuta la siguiente consulta jerárquica para simular los requerimientos de un Dashboard empresarial:
   ```graphql
   query GetDashboardData {
     clientes {
       nombre
       sector
       facturas {
         monto
       }
     }
   }
   ```
3. **Observa la consola de tu terminal.** Notarás que para recuperar solo 3 clientes, el servidor ejecuta **4 consultas simuladas** (`1` para obtener los clientes y `N` individuales para las facturas de cada cliente).
4. El tiempo de respuesta acumulado se degrada drásticamente debido a las llamadas secuenciales redundantes a la capa de datos.

### Fase 2: Implementación de la Solución (Objetivo de Evaluación)
Para superar la práctica con éxito, debes modificar el archivo `server.js` para cumplir con las siguientes directrices de arquitectura:
* **Crear el Método por Lotes:** Modifica el objeto de persistencia para implementar una función que reciba un arreglo de llaves (`clienteIds`) y devuelva las facturas agrupadas utilizando una consulta selectiva única.
* **Instanciar el DataLoader en el Contexto:** Configura la inicialización de Apollo Server de manera que el `DataLoader` se instancie de forma dinámica dentro de la función `context` por petición. *¡Atención! Instanciar el Loader fuera de este bloque de manera global invalidará la entrega por generar riesgos de fuga de información entre usuarios.*
* **Actualizar el Resolver:** Modifica el solucionador de la propiedad `facturas` en el tipo `Cliente` para que invoque el método `.load()` del cargador inyectado en el contexto.

---

## 📝 Formato de Entrega

Deberás subir a la plataforma institucional un archivo comprimido (`.zip`) con el nombre `Apellido_Nombre_Practica3_GraphQL` que contenga:
1. Tu archivo `server.js` completamente funcional y optimizado.
2. Un breve archivo de texto (`reporte.txt` o modificado en este mismo documento) indicando el número exacto de consultas impresas en consola tras aplicar el patrón DataLoader al ejecutar la misma query.

*Nota: Excluye explícitamente la carpeta `node_modules/` al empaquetar tu entrega.*
