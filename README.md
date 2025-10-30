# Bsale - Aplicación web con Express (Fase II)

Aplicación web para gestionar el registro y actualización de datos de empresas utilizando la API de Bsale. Este proyecto forma parte de la renovación del proceso de afiliación y puesta en marcha de nuevos clientes.

## Descripción del proyecto

Sistema web que permite visualizar y actualizar información de empresas mediante un formulario interactivo. La aplicación consume una API REST para obtener y actualizar datos de empresas, implementando una arquitectura backend con Express.js y paradigma de Programación Orientada a Objetos.

### Fase II - Integración con backend y API

En esta segunda fase se implementó:
I. Creación del formulario y despliegue de datos

- Carga automática de datos: Al desplegar el formulario se cargan los datos asociados a una determinada empresa mediante llamada GET a la API
- Obtención del ID desde la URL: El ID de la empresa se extrae dinámicamente de la URL
- API Externa: Comunicación con http://54.183.76.110:7171

II. Backend con Express y Arquitectura POO

- Servidor Express: Actúa como proxy entre el frontend y la API externa
- Modelo Company: Clase que encapsula los datos y operaciones de una empresa
- Rutas RESTful: Endpoints para obtener y actualizar empresas
- Separación de responsabilidades: Modelo-Ruta

Funcionalidades principales:

1. Carga automática: Los datos de la empresa se cargan al abrir el formulario
2. Edición de datos: El usuario puede modificar los campos
3. Validación: Campos obligatorios y formato de email
4. Confirmación: Dialog para revisar datos antes de guardar
5. Actualización: Envío de datos modificados a la API mediante PUT

## Tecnologías utilizadas
Frontend
- **HTML5**: Estructura semántica del formulario
- **CSS3**: Estilos personalizados con CSS Grid para diseño responsivo
- **JavaScript (Vanilla)**: Lógica de validación, captura de datos y comunicación con API
- **Google Material Design Components**: Componentes UI (Text Fields, Buttons, Radio Buttons, Dialog)
- **Material Symbols**: Iconografía

Backend
- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web

API Externa de Bsale
- GET /v1/companies/:id.json - Obtener datos de empresa
- PUT /v1/companies/:id.json - Actualizar datos de empresa

## Características Principales

### Nuevas funcionalidades implementadas

Frontend

- **Navegación suave entre secciones con scroll**
- **Intersection Observer para detectar sección activa**
- **Validación de formato de email**
- **Carga automática de datos desde la API al iniciar**
- **Actualización de datos mediante formulario**

Backend

- **Servidor Express configurado con middlewares**
- **Clase Company que encapsula datos y métodos**
- **Rutas RESTful bien estructuradas**
- **Manejo de errores en todas las capas**
- **Validación de IDs en el servidor**
- **Separación de responsabilidades (Modelo-Ruta)**

## Estructura del proyecto
```
proyecto/
├── models/
│   └── company.js              # Clase Company con métodos para la API
├── routes/
│   └── companies.js            # Rutas de la API (GET, PUT)
├── public/
│   ├── images/
│   │   └── logo-bsale.png      # Logo de Bsale
│   ├── scripts.js              # Lógica del frontend
│   └── styles.css              # Estilos personalizados
├── node_modules/               # Dependencias
├── .env                        # Variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── index.html                  # Página principal
├── package.json                # Configuración del proyecto
├── package-lock.json           # Dependencias bloqueadas
├── README.md                   # Documentación del proyecto
└── server.js                   # Servidor Express
```

## Instalación y Uso

### Pasos para ejecutar

1. **Clonar o descargar el proyecto**
```
  git clone https://github.com/AgustinDonofrio/bsale-starkteam-tarea2.git
  cd bsale-formulario
```

2. **Instalar dependencias**
```
  npm install
```

3. **Iniciar el servidor**
```
  npm run start
```

4. **Abrir el navegador y pegar la URL**
```
  http://localhost:3000/companies/1829.json
```

## API Endpoints

### 1. Obtener HTML del formulario: GET /companies/:id.json

**Descripción**: Retorna la página HTML del formulario

**Parámetros**:
- `id` (path): ID de la compañía

**Respuesta**: Archivo `index.html`

### 2. Obtener datos de una empresa: GET /companies/api/:id.json

**Descripción**: Obtiene los datos de una empresa desde la API externa

**Parámetros**:
- `id` (path): ID de la compañía

**Respuesta exitosa (2XX)**: 
Los datos del formulario se almacenan en un objeto JavaScript:
```javascript
{
  "code": 200,
  "data": {
    "id": 1829,
    "cpnCode": "12345678-9",
    "cpnName": "EMPRESA EJEMPLO LTDA",
    "cpnLegalAddress": "Calle Principal 123",
    "cpnLegalCounty": "Santiago",
    "activity": "Comercio",
    "legalAgentCode": "98765432-1",
    "legalAgentName": "Juan Pérez",
    "legalAgentEmail": "juan@empresa.cl",
    "cpnDteActive": 1
  }
}
```

**Respuesta de error en el cliente (4XX)**
```javascript
{
  "code": 400,
  "errors": "ID de la companía inválido"
}
```

**Respuesta de error en el servidor (5XX)**
```javascript
{
  "code": 500,
  "errors": "Error interno del servidor"
}
```

### 3. Actualizar datos de una empresa: PUT /companies/api/:id.json
**Descripción**: Actualiza los datos de una empresa en la API externa

**Parámetros**:
- `id` (path): ID de la compañía

**Body (JSON)**:
```javascript
  {
    "cpnCode": "12345678-9",
    "cpnName": "EMPRESA ACTUALIZADA LTDA",
    "cpnLegalAddress": "Nueva Dirección 456",
    "cpnLegalCounty": "Valparaíso",
    "activity": "Servicios",
    "legalAgentCode": "11111111-1",
    "legalAgentName": "María González",
    "legalAgentEmail": "maria@empresa.cl",
    "cpnDteActive": 1
  }
```