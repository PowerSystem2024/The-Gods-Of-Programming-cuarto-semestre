import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description: 'API completa para aplicación de e-commerce con autenticación, productos, carrito y órdenes',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.production.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña encriptada',
              example: 'Password123!'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Rol del usuario en el sistema'
            },
            cart: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              },
              description: 'Items en el carrito del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'category', 'images'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del producto',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Tarta de Chocolate'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del producto',
              example: 'Deliciosa tarta de chocolate con crema'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Precio en pesos argentinos',
              example: 5000
            },
            category: {
              type: 'string',
              enum: ['tortas', 'pastelitos', 'galletas', 'postres', 'otros'],
              description: 'Categoría del producto',
              example: 'tortas'
            },
            stock: {
              type: 'number',
              minimum: 0,
              default: 0,
              description: 'Cantidad disponible en inventario',
              example: 10
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'URLs de las imágenes del producto',
              example: ['https://example.com/image1.jpg']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CartItem: {
          type: 'object',
          required: ['product', 'quantity'],
          properties: {
            product: {
              type: 'string',
              description: 'ID del producto',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Tarta de Chocolate'
            },
            price: {
              type: 'number',
              description: 'Precio unitario',
              example: 5000
            },
            quantity: {
              type: 'number',
              minimum: 1,
              description: 'Cantidad del producto',
              example: 2
            },
            subtotal: {
              type: 'number',
              description: 'Subtotal (precio * cantidad)',
              example: 10000
            }
          }
        },
        Order: {
          type: 'object',
          required: ['user', 'items', 'total', 'contactInfo', 'shippingAddress', 'paymentMethod'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            user: {
              type: 'string',
              description: 'ID del usuario que realizó la orden',
              example: '507f1f77bcf86cd799439011'
            },
            orderNumber: {
              type: 'string',
              description: 'Número único de orden',
              example: 'ORD-1699123456789'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem'
              }
            },
            contactInfo: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'Juan' },
                lastName: { type: 'string', example: 'Pérez' },
                email: { type: 'string', example: 'juan@example.com' },
                phone: { type: 'string', example: '+54911234567' },
                dni: { type: 'string', example: '12345678' }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Av. Corrientes' },
                number: { type: 'string', example: '1234' },
                floor: { type: 'string', example: '5' },
                apartment: { type: 'string', example: 'A' },
                city: { type: 'string', example: 'Buenos Aires' },
                province: { type: 'string', example: 'CABA' },
                postalCode: { type: 'string', example: '1043' },
                country: { type: 'string', example: 'Argentina' },
                additionalInfo: { type: 'string', example: 'Timbre 5A' }
              }
            },
            paymentMethod: {
              type: 'string',
              enum: ['transferencia', 'mercadopago', 'efectivo'],
              example: 'transferencia'
            },
            subtotal: {
              type: 'number',
              description: 'Subtotal sin envío',
              example: 45000
            },
            shippingCost: {
              type: 'number',
              description: 'Costo de envío',
              example: 5000
            },
            total: {
              type: 'number',
              description: 'Total de la orden',
              example: 50000
            },
            status: {
              type: 'string',
              enum: ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'],
              default: 'pendiente',
              example: 'pendiente'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pendiente', 'pagado', 'rechazado'],
              default: 'pendiente',
              example: 'pendiente'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'Tarta de Chocolate'
            },
            price: {
              type: 'number',
              example: 5000
            },
            quantity: {
              type: 'number',
              example: 2
            },
            subtotal: {
              type: 'number',
              example: 10000
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'No autorizado - Token inválido o faltante',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'No autorizado. Token inválido o faltante.'
              }
            }
          }
        },
        Forbidden: {
          description: 'Acceso prohibido - Permisos insuficientes',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'No tienes permisos para realizar esta acción.'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Recurso no encontrado.'
              }
            }
          }
        },
        BadRequest: {
          description: 'Solicitud inválida - Error de validación',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Error de validación',
                errors: [
                  {
                    field: 'email',
                    message: 'Email inválido'
                  }
                ]
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Error interno del servidor.'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y autorización'
      },
      {
        name: 'Products',
        description: 'Gestión de productos'
      },
      {
        name: 'Cart',
        description: 'Gestión del carrito de compras'
      },
      {
        name: 'Orders',
        description: 'Gestión de órdenes de compra'
      }
    ]
  },
  apis: [
    './routes/*.js', 
    './controllers/*.js',
    './docs/swagger/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
