import { db } from './database.js';

// RESOLUTORES - IMPLEMENTACIÓN OPTIMIZADA (DataLoader: batching + caché por petición)
export const resolvers = {
    Query: {
        clientes: async () => await db.fetchAllClientes(),
    },
    Cliente: {
        facturas: (parent, _args, { loaders }) => {
            // En lugar de consultar la BD directamente, se encola la llave en el loader de la petición.
            // DataLoader agrupa todas las llamadas .load() del mismo tick en UNA sola consulta por lotes.
            return loaders.facturasPorCliente.load(parent.id);
        }
    }
};
