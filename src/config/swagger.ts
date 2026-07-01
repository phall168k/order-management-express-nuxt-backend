import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Order Management API",
            version: "1.0.0",
            description: "API documentation for the order management backend.",
        },
        servers: [
            {
                url: "/api/v1",
                description: "API v1",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Permission: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b12345",
                        },
                        name: {
                            type: "string",
                            example: "permission.create",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Role: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b54321",
                        },
                        name: {
                            type: "string",
                            example: "admin",
                        },
                        permissions: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Permission",
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99999",
                        },
                        username: {
                            type: "string",
                            example: "admin",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "admin@example.com",
                        },
                        roles: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Role",
                            },
                        },
                        isSuperUser: {
                            type: "boolean",
                            example: false,
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                LoginUserResponse: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99999",
                        },
                        username: {
                            type: "string",
                            example: "admin",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "admin@example.com",
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                        isSuperUser: {
                            type: "boolean",
                            example: false,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                        roles: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Role",
                            },
                        },
                        permission: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["role.read", "user.read"],
                        },
                    },
                },
                CreatePermissionRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            example: "permission.create",
                        },
                    },
                },
                UpdatePermissionRequest: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "permission.update",
                        },
                    },
                },
                CreateRoleRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            example: "admin",
                        },
                        permissions: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["65f1a9f2c1a3a7d9f3b12345"],
                        },
                    },
                },
                UpdateRoleRequest: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "manager",
                        },
                        permissions: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["65f1a9f2c1a3a7d9f3b12345"],
                        },
                    },
                },
                CreateUserRequest: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: {
                            type: "string",
                            example: "admin",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "admin@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "secret123",
                        },
                        roles: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["65f1a9f2c1a3a7d9f3b54321"],
                        },
                        isSuperUser: {
                            type: "boolean",
                            example: false,
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
                UpdateUserRequest: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            example: "manager",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "manager@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "secret123",
                        },
                        roles: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["65f1a9f2c1a3a7d9f3b54321"],
                        },
                        isSuperUser: {
                            type: "boolean",
                            example: false,
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["usernameOrEmail", "password"],
                    properties: {
                        usernameOrEmail: {
                            type: "string",
                            example: "admin@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "Password@123",
                        },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b77777",
                        },
                        code: {
                            type: "string",
                            example: "FOOD",
                        },
                        nameEn: {
                            type: "string",
                            example: "Food",
                        },
                        nameKh: {
                            type: "string",
                            example: "Food KH",
                        },
                        description: {
                            type: "string",
                            example: "Food products",
                        },
                        createdByUser: {
                            $ref: "#/components/schemas/User",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CreateCategoryRequest: {
                    type: "object",
                    required: ["code", "nameEn", "nameKh"],
                    properties: {
                        code: {
                            type: "string",
                            example: "FOOD",
                        },
                        nameEn: {
                            type: "string",
                            example: "Food",
                        },
                        nameKh: {
                            type: "string",
                            example: "Food KH",
                        },
                        description: {
                            type: "string",
                            example: "Food products",
                        },
                    },
                },
                UpdateCategoryRequest: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            example: "DRINK",
                        },
                        nameEn: {
                            type: "string",
                            example: "Drink",
                        },
                        nameKh: {
                            type: "string",
                            example: "Drink KH",
                        },
                        description: {
                            type: "string",
                            example: "Drink products",
                        },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        code: {
                            type: "string",
                            example: "PROD-001",
                        },
                        nameEn: {
                            type: "string",
                            example: "Sample Product",
                        },
                        nameKh: {
                            type: "string",
                            example: "Sample Product KH",
                        },
                        unitPrice: {
                            type: "number",
                            example: 12.5,
                        },
                        description: {
                            type: "string",
                            example: "Sample product description",
                        },
                        thumbnail: {
                            type: "string",
                            example: "uploads/products/sample-product.jpg",
                        },
                        category: {
                            $ref: "#/components/schemas/Category",
                        },
                        createdByUser: {
                            $ref: "#/components/schemas/User",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CreateProductRequest: {
                    type: "object",
                    required: ["code", "nameEn", "nameKh", "unitPrice", "thumbnail", "category"],
                    properties: {
                        code: {
                            type: "string",
                            example: "PROD-001",
                        },
                        nameEn: {
                            type: "string",
                            example: "Sample Product",
                        },
                        nameKh: {
                            type: "string",
                            example: "Sample Product KH",
                        },
                        unitPrice: {
                            type: "number",
                            example: 12.5,
                        },
                        description: {
                            type: "string",
                            example: "Sample product description",
                        },
                        thumbnail: {
                            type: "string",
                            example: "uploads/products/sample-product.jpg",
                        },
                        category: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b77777",
                        },
                    },
                },
                UpdateProductRequest: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            example: "PROD-002",
                        },
                        nameEn: {
                            type: "string",
                            example: "Updated Product",
                        },
                        nameKh: {
                            type: "string",
                            example: "Updated Product KH",
                        },
                        unitPrice: {
                            type: "number",
                            example: 15,
                        },
                        description: {
                            type: "string",
                            example: "Updated product description",
                        },
                        thumbnail: {
                            type: "string",
                            example: "uploads/products/updated-product.jpg",
                        },
                        category: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b77777",
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: {
                            type: "number",
                            example: 25,
                        },
                        page: {
                            type: "number",
                            example: 1,
                        },
                        limit: {
                            type: "number",
                            example: 10,
                        },
                        totalPages: {
                            type: "number",
                            example: 3,
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/**/*.route.ts"],
});
