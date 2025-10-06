import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Galipette Backend API',
      version: '1.0.0',
      description: 'API documentation for the Galipette RPG platform backend',
      contact: {
        name: 'Galipette Team',
        email: 'contact@galipette.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier',
            },
            username: {
              type: 'string',
              description: 'User username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Campaign: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Campaign unique identifier',
            },
            name: {
              type: 'string',
              description: 'Campaign name',
            },
            description: {
              type: 'string',
              description: 'Campaign description',
            },
            gameMasterId: {
              type: 'string',
              description: 'Game Master user ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign last update timestamp',
            },
          },
        },
        Character: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Character unique identifier',
            },
            name: {
              type: 'string',
              description: 'Character name',
            },
            ancestryId: {
              type: 'string',
              description: 'Character ancestry ID',
            },
            playerId: {
              type: 'string',
              description: 'Player user ID',
            },
            campaignId: {
              type: 'string',
              description: 'Campaign ID',
            },
            attributes: {
              type: 'object',
              description: 'Character attributes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Character creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Character last update timestamp',
            },
          },
        },
        Ancestry: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Ancestry unique identifier',
            },
            name: {
              type: 'string',
              description: 'Ancestry name',
            },
            description: {
              type: 'string',
              description: 'Ancestry description',
            },
            attributes: {
              type: 'object',
              description: 'Ancestry base attributes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Ancestry creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Ancestry last update timestamp',
            },
          },
        },
        Affliction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Affliction unique identifier',
            },
            name: {
              type: 'string',
              description: 'Affliction name',
            },
            description: {
              type: 'string',
              description: 'Affliction description',
            },
            effects: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Affliction effects',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Affliction tags',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Affliction creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Affliction last update timestamp',
            },
          },
        },
        Rule: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Rule unique key',
            },
            name: {
              type: 'string',
              description: 'Rule name',
            },
            description: {
              type: 'string',
              description: 'Rule description',
            },
            content: {
              type: 'string',
              description: 'Rule content',
            },
            category: {
              type: 'string',
              description: 'Rule category',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Rule creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Rule last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
        },
      },
    },
  },
  apis: ['./src/docs/**/*.yaml'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  try {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Galipette API Documentation',
      })
    );
    console.log('Swagger documentation available at /api-docs');
  } catch (error) {
    console.error('Failed to setup Swagger:', error);
  }
};

export default specs;
