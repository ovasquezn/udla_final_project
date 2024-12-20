import { Facturas } from './Facturas.js';
import { Proveedores } from './Proveedores.js';
import { DetalleFacturas } from './DetalleFacturas.js';
import { Colaboradores } from './Colaboradores.js';
import { PagosColaboradores } from './PagosColaboradores.js';
import { Liquidaciones } from './Liquidaciones.js';
import { Documentos } from './Documentos.js';
import { Usuarios } from './Usuarios.js';
import { Empresas } from './Empresas.js';
import { Inventarios } from './Inventarios.js';
import { Movimientos } from './Movimientos.js';
import { MovimientosBancarios } from './MovimientosBancarios.js';
import { Productos } from './Productos.js';
import { FacturasEmitidas } from './FacturasEmitidas.js';
import { Bancos } from './Bancos.js';
import { Clientes } from './Clientes.js';

// Relación Colaboradores - Pagos (uno a muchos)
Colaboradores.hasMany(PagosColaboradores, { foreignKey: 'trabajador_id', as: 'pagos_colaboradores' });
PagosColaboradores.belongsTo(Colaboradores, { foreignKey: 'trabajador_id' });

// Relación Colaboradores - Liquidaciones (uno a muchos)
Colaboradores.hasMany(Liquidaciones, { foreignKey: 'trabajador_id', as: 'liquidaciones' });
Liquidaciones.belongsTo(Colaboradores, { foreignKey: 'trabajador_id' });

// Relación Colaboradores - Documentos (uno a muchos)
Colaboradores.hasMany(Documentos, { foreignKey: 'trabajador_id', as: 'documentos' });
Documentos.belongsTo(Colaboradores, { foreignKey: 'trabajador_id' });

// Relación entre Facturas y Proveedores
Proveedores.hasMany(Facturas, { foreignKey: 'proveedor_id', as: 'facturas' });
Facturas.belongsTo(Proveedores, { foreignKey: 'proveedor_id', as: 'proveedor' });

// Relación entre DetalleFacturas y Facturas
Facturas.hasMany(DetalleFacturas, { foreignKey: 'factura_id', as: 'detalle_factura' });
DetalleFacturas.belongsTo(Facturas, { foreignKey: 'factura_id', as: 'factura' });

DetalleFacturas.belongsTo(Productos, { foreignKey: 'producto_id', as: 'producto' });
Productos.hasMany(DetalleFacturas, { foreignKey: 'producto_id', as: 'detalleFacturas' });
//DetalleFactura.belongsTo(Productos, { foreignKey: 'producto_id', as: 'producto' });

// Relación entre Usuarios y Empresas (Uno a Muchos)
Empresas.hasMany(Usuarios, { foreignKey: 'empresaId', as: 'usuarios' });

// Duplicado?
//Empresas.hasMany(Colaboradores, { foreignKey: 'empresaId', as: 'colaboradores' });
Usuarios.belongsTo(Colaboradores, { foreignKey: 'colaboradorId', as: 'colaboradores' });  // Relación opcional

// Relación entre todas las tablas y Empresas
DetalleFacturas.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_detalle_facturas' });
Colaboradores.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_colaboradores' });
Usuarios.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_usuarios' });
Facturas.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_facturas' });
Inventarios.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_inventarios' });
Liquidaciones.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_liquidaciones' });
Movimientos.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_movimientos' });
MovimientosBancarios.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_movimientos_bancarios' });
PagosColaboradores.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_pagos_colaboradores' });    
Productos.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_productos' });
Proveedores.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_proveedores' });
FacturasEmitidas.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_facturas_emitidas' });

Productos.belongsTo(Inventarios, { foreignKey: 'inventario_id', as: 'inventario' });
Inventarios.hasMany(Productos, { foreignKey: 'inventario_id', as: 'productos' });

Productos.hasMany(Movimientos, { foreignKey: 'producto_id', as: 'movimientos' });
Movimientos.belongsTo(Productos, { foreignKey: 'producto_id', as: 'producto_movimiento' });

// Relación entre Liquidaciones y Meses
//Liquidaciones.belongsTo(Meses, { foreignKey: 'mesId', as: 'mes' });
//Meses.hasMany(Liquidaciones, { foreignKey: 'mesId', as: 'liquidaciones' });

Bancos.hasMany(MovimientosBancarios, { foreignKey: 'banco_id', as: 'movimientos_bancarios' });
MovimientosBancarios.belongsTo(Bancos, { foreignKey: 'banco_id', as: 'banco' });
Empresas.hasMany(Bancos, { foreignKey: 'empresaId', as: 'bancos' });

Clientes.hasMany(FacturasEmitidas, { foreignKey: 'clienteId', as: 'facturas_emitidas' });
FacturasEmitidas.belongsTo(Clientes, { foreignKey: 'clienteId', as: 'cliente_info' });

Clientes.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa_clientes' });


export { Bancos, Facturas, Clientes, Proveedores, DetalleFacturas, Colaboradores, PagosColaboradores, Liquidaciones, Documentos, Usuarios, Empresas, Inventarios, Movimientos, MovimientosBancarios, Productos, FacturasEmitidas};