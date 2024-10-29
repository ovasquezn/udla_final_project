
import { Facturas } from './Facturas.js';
import { Proveedores } from './Proveedores.js';
import { DetalleFacturas } from './DetalleFacturas.js';
import { Colaboradores } from './Colaboradores.js';
import { PagosColaboradores } from './PagosColaboradores.js';
import { Liquidaciones } from './Liquidaciones.js';
import { Documentos } from './Documentos.js';
import { Usuarios } from './Usuarios.js';
import { Empresas } from './Empresas.js';

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

// Relación entre Usuarios y Empresas (Uno a Muchos)
Empresas.hasMany(Usuarios, { foreignKey: 'empresaId', as: 'usuarios' });
Usuarios.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresas' });

Empresas.hasMany(Colaboradores, { foreignKey: 'empresaId', as: 'colaboradores' });
Colaboradores.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresas' });

Usuarios.belongsTo(Colaboradores, { foreignKey: 'colaboradorId', as: 'colaboradores' });  // Relación opcional

export { Facturas, Proveedores, DetalleFacturas, Colaboradores, PagosColaboradores, Liquidaciones, Documentos, Usuarios, Empresas };