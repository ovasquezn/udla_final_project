import db from './db.js';

import { Empresas } from '../models/Empresas.js';
import { Colaboradores } from '../models/Colaboradores.js';
import { Usuarios } from '../models/Usuarios.js';

import { Documentos } from '../models/Documentos.js';
import { Liquidaciones } from '../models/Liquidaciones.js';

import { Inventarios } from '../models/Inventarios.js'
import { Productos } from '../models/Productos.js';
import { Proveedores } from '../models/Proveedores.js';
import { Movimientos } from '../models/Movimientos.js';
import { Facturas } from '../models/Facturas.js';
import { DetalleFacturas } from '../models/DetalleFacturas.js';
import { MovimientosBancarios } from '../models/MovimientosBancarios.js';
import { FacturasEmitidas } from '../models/FacturasEmitidas.js'; 

import { PagosColaboradores } from '../models/PagosColaboradores.js';


const syncDatabase = async () => {
  try {
    await db.sync({ force: true });
    console.log('Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  } finally {
    await db.close();
  }
};

syncDatabase();