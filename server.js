import { readFileSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createLoaders } from './dataloaders.js';

// Modo de ejecución: `node server.js` (optimizado) o `node server.js --ingenuo` (N+1)
const modoIngenuo = process.argv.includes('--ingenuo');
const { resolvers } = await import(modoIngenuo ? './resolvers.naive.js' : './resolvers.js');

// 1. DEFINICIÓN DEL ESQUEMA (SDL) - cargado desde schema.graphql
const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf-8');

// 2. INICIALIZACIÓN DEL SERVIDOR
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // Se crea un DataLoader NUEVO por cada petición: la caché no se comparte entre usuarios.
    context: async () => ({ loaders: createLoaders() }),
});
console.log(`🚀 Servidor Académico listo en: ${url} (modo ${modoIngenuo ? 'INGENUO - N+1' : 'OPTIMIZADO - DataLoader'})`);
