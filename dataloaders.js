import DataLoader from 'dataloader';
import { db } from './database.js';

/**
 * Batch Function: recibe TODAS las llaves (clienteIds) acumuladas durante un mismo tick
 * del event loop y las resuelve en un solo viaje a la base de datos.
 *
 * Contrato de DataLoader: debe devolver un arreglo del mismo tamaño y en el mismo orden
 * que las llaves recibidas (clientes sin facturas -> []).
 */
const batchFacturasPorCliente = async (clienteIds) => {
    return await db.fetchFacturasByClienteIdsBatch(clienteIds);
};

/**
 * Fábrica de loaders. Debe invocarse UNA VEZ POR PETICIÓN (en el `context` de Apollo)
 * para que la caché viva solo durante esa petición y no se compartan datos entre usuarios.
 */
export const createLoaders = () => ({
    facturasPorCliente: new DataLoader(batchFacturasPorCliente),
});
