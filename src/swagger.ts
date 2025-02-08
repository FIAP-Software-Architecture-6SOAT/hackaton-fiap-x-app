/* eslint-disable @typescript-eslint/no-floating-promises */
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import path from 'path';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/fiap-x-app-swagger.yaml'));

export const setupSwagger = (app: FastifyInstance): void => {
  app.register(fastifySwagger, {
    mode: 'static',
    specification: {
      path: path.join(__dirname, '../docs/fiap-x-app-swagger.yaml'),
      baseDir: path.join(__dirname, '../docs'),
      postProcessor: (swaggerObject) => swaggerObject,
    },
    exposeRoute: true,
  });

  const swaggerOptions = {
    swaggerOptions: {
      urls: [],
      dom_id: '#swagger-ui',
      deepLinking: true,
      layout: 'StandaloneLayout',
    },
  };

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: (request, reply, next) => {
        next();
      },
      preHandler: (request, reply, next) => {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    ...swaggerOptions,
  });
};
