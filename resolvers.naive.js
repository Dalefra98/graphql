import { db } from './database.js';

// RESOLUTORES - IMPLEMENTACIÓN INGENUA (provoca el problema N+1)
export const resolvers = {
    Query: {
        clientes: async () => await db.fetchAllClientes(),
    },
    Cliente: {
        facturas: async (parent) => {
            // El 'parent' es el cliente actual. GraphQL llama a esta función por CADA cliente devuelto,
            // generando 1 consulta de clientes + N consultas de facturas.
            return await db.fetchFacturasByClienteId(parent.id);
        }
    }
};
