import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5500
  },
  plugins: [
    {
      name: 'api-solicitud-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/solicitud' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            // Simular respuesta positiva en entorno local de Vite
            setTimeout(() => {
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Modo desarrollo (Vite): Solicitud simulada con éxito.',
                id: 'dev_mock_id'
              }));
            }, 600);
            return;
          }
          next();
        });
      }
    }
  ]
})
