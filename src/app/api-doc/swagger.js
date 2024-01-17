import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: `Flashie API Docs`,
        version: '1.0',
      },
      components: {
        securitySchemes: {
          // BearerAuth: {
          //   type: 'http',
          //   scheme: 'bearer',
          //   bearerFormat: 'JWT',
          // },
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: '__Secure-next-auth.session-token',
          },
        },
      },
      security: [],
    },
  })
  return spec
}
