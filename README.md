
# 🏢 Proyecto de Título - UDLA

**Software para la gestión operativa de un restaurante, centralizando y automatizando procesos clave en inventario, facturación y recursos humanos.**

## 🚀 Descripción del Proyecto

Este proyecto se desarrolló para optimizar la eficiencia y precisión en la operación diaria de un restaurante a través de un sistema de gestión completo y modular. Mediante la implementación de herramientas automatizadas y centralizadas, el software permite un control robusto sobre áreas críticas del negocio, incluyendo inventario, administración de facturas con conciliación bancaria y gestión de recursos humanos.

## 🎯 Objetivos del Proyecto

### Objetivo General
Desarrollar un software de gestión integral que centralice los procesos operativos del restaurante, automatizando tareas clave y mejorando la precisión y control en el manejo del inventario, las facturas y la administración de recursos humanos.

### Objetivos Específicos
1. Involucrar a los stakeholders en el proyecto y atender sus necesidades e inquietudes sobre los procesos que se abordarán.
2. Definir y documentar los requisitos funcionales y no funcionales para el software propuesto.
3. Diseñar una arquitectura basada en el patrón **MVC** (Modelo-Vista-Controlador) que sea escalable, modular y fácil de mantener.
4. Asegurar que el sistema sea adaptable para incorporar nuevos módulos y funciones a medida que el negocio evoluciona.
5. Realizar pruebas exhaustivas en componentes, usabilidad, carga y seguridad para garantizar un funcionamiento óptimo.

## 🛠️ Arquitectura del Sistema

La arquitectura del sistema sigue el patrón **MVC**, que facilita la organización y estructura del código en tres capas principales:

- **Modelo**: Gestiona la lógica de datos y manipulación de la base de datos.
- **Vista**: Proporciona una interfaz gráfica para los usuarios finales, optimizando la experiencia de usuario.
- **Controlador**: Enlaza la lógica entre el modelo y la vista, manejando las solicitudes y lógica de negocio del sistema.

Esta estructura asegura escalabilidad, modularidad y flexibilidad, permitiendo futuras extensiones del sistema con nuevos módulos y mejoras en las funcionalidades existentes.

## 📂 Módulos Principales

1. **Inventario**
   - Controla el stock de productos.
   - Gestiona alertas de productos con bajo inventario.
   - Registra y visualiza movimientos de inventario, permitiendo una gestión detallada de cada insumo.

2. **Facturación y Finanzas**
   - Administra las facturas y concilia las operaciones bancarias.
   - Realiza el seguimiento de pagos pendientes, montos por vencer y reportes financieros.
   - Permite la integración con cuentas bancarias para un proceso de conciliación eficiente y preciso.

3. **Recursos Humanos**
   - Gestiona el personal, sus liquidaciones, contratos y más documentos.
   - Permite el registro de asistencias, ausencias, y emisión de notificaciones relacionadas con el personal (pendiente).
   - Facilita la administración de contratos, permisos y control de la nómina.

## 📊 Diagrama de Componentes

A continuación se describe brevemente el diseño de componentes implementado:
- **Base de Datos**: Gestiona tablas para usuarios, empresas, colaboradores, facturas, productos, y liquidaciones.
- **Controlador**: Maneja la lógica de negocio en cada módulo, facilitando la comunicación entre la vista y el modelo.
- **Vista**: Desarrollada en un framework de interfaz (Bootstrap), ofrece acceso a cada módulo mediante menús y secciones interactivas.
- **Autenticación**: Seguridad mediante JWT y control de acceso por roles.

## 🔒 Control de Acceso y Seguridad

El sistema implementa un control de acceso robusto basado en roles:
- **Propietario**: Acceso completo a todas las funcionalidades y módulos.
- **Administrador**: Acceso a todos los módulos excepto la sección de Finanzas/Banco.
- **Colaborador**: Acceso limitado al perfil personal.

La autenticación se gestiona con tokens JWT, proporcionando una capa de seguridad adicional y control sobre las sesiones.

## 🧑‍💻 Participantes del Proyecto

| Nombre             | Rol                 |
|--------------------|---------------------|
| Víctor Ruiz        | Desarrollador       |
| Orlando Vásquez       | Desarrollador       |


## ⚙️ Requisitos de Software y Dependencias

- **Backend**: Node.js, Express.js, Sequelize, JWT para autenticación.
- **Frontend**: Pug, Bootstrap.
- **Base de Datos**: PostgreSQL.

## 📝 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ovasquezn/udla_final_project
