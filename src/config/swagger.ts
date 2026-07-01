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
                        userProfile: {
                            $ref: "#/components/schemas/UserProfile",
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
                        userProfile: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b66666",
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
                        userProfile: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b66666",
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
                UserProfile: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b66666",
                        },
                        code: {
                            type: "string",
                            example: "UP-001",
                        },
                        userType: {
                            type: "string",
                            enum: ["customer", "staff"],
                            example: "staff",
                        },
                        firstName: {
                            type: "string",
                            example: "Sok",
                        },
                        lastName: {
                            type: "string",
                            example: "Dara",
                        },
                        gender: {
                            type: "string",
                            enum: ["male", "female", "other"],
                            example: "male",
                        },
                        dob: {
                            type: "string",
                            format: "date",
                            example: "1998-01-15",
                        },
                        phoneNumber: {
                            type: "string",
                            example: "+85512345678",
                        },
                        address: {
                            type: "string",
                            example: "Phnom Penh",
                        },
                        note: {
                            type: "string",
                            example: "Internal staff profile",
                        },
                        profile: {
                            type: "string",
                            example: "uploads/profiles/sok-dara.jpg",
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
                CreateUserProfileRequest: {
                    type: "object",
                    required: ["code", "userType", "firstName", "lastName"],
                    properties: {
                        code: {
                            type: "string",
                            example: "UP-001",
                        },
                        userType: {
                            type: "string",
                            enum: ["customer", "staff"],
                            example: "staff",
                        },
                        firstName: {
                            type: "string",
                            example: "Sok",
                        },
                        lastName: {
                            type: "string",
                            example: "Dara",
                        },
                        gender: {
                            type: "string",
                            enum: ["male", "female", "other"],
                            example: "male",
                        },
                        dob: {
                            type: "string",
                            format: "date",
                            example: "1998-01-15",
                        },
                        phoneNumber: {
                            type: "string",
                            example: "+85512345678",
                        },
                        address: {
                            type: "string",
                            example: "Phnom Penh",
                        },
                        note: {
                            type: "string",
                            example: "Internal staff profile",
                        },
                        profile: {
                            type: "string",
                            example: "uploads/profiles/sok-dara.jpg",
                        },
                        createdByUser: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99999",
                        },
                    },
                },
                UpdateUserProfileRequest: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            example: "UP-002",
                        },
                        userType: {
                            type: "string",
                            enum: ["customer", "staff"],
                            example: "customer",
                        },
                        firstName: {
                            type: "string",
                            example: "Updated",
                        },
                        lastName: {
                            type: "string",
                            example: "Name",
                        },
                        gender: {
                            type: "string",
                            enum: ["male", "female", "other"],
                            example: "other",
                        },
                        dob: {
                            type: "string",
                            format: "date",
                            example: "1999-02-20",
                        },
                        phoneNumber: {
                            type: "string",
                            example: "+85598765432",
                        },
                        address: {
                            type: "string",
                            example: "Siem Reap",
                        },
                        note: {
                            type: "string",
                            example: "Updated note",
                        },
                        profile: {
                            type: "string",
                            example: "uploads/profiles/updated.jpg",
                        },
                        createdByUser: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99999",
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
                Stock: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b55555",
                        },
                        product: {
                            $ref: "#/components/schemas/Product",
                        },
                        minStock: {
                            type: "number",
                            example: 10,
                        },
                        stockIn: {
                            type: "number",
                            example: 100,
                        },
                        stockOut: {
                            type: "number",
                            example: 20,
                        },
                        stockAdjustment: {
                            type: "number",
                            example: 5,
                        },
                        isStock: {
                            type: "boolean",
                            example: true,
                        },
                        note: {
                            type: "string",
                            example: "Initial stock entry",
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
                CreateStockRequest: {
                    type: "object",
                    required: ["product", "minStock", "stockIn", "stockOut", "stockAdjustment"],
                    properties: {
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        minStock: {
                            type: "number",
                            example: 10,
                        },
                        stockIn: {
                            type: "number",
                            example: 100,
                        },
                        stockOut: {
                            type: "number",
                            example: 20,
                        },
                        stockAdjustment: {
                            type: "number",
                            example: 5,
                        },
                        isStock: {
                            type: "boolean",
                            example: true,
                        },
                        note: {
                            type: "string",
                            example: "Initial stock entry",
                        },
                    },
                },
                UpdateStockRequest: {
                    type: "object",
                    properties: {
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        minStock: {
                            type: "number",
                            example: 12,
                        },
                        stockIn: {
                            type: "number",
                            example: 120,
                        },
                        stockOut: {
                            type: "number",
                            example: 25,
                        },
                        stockAdjustment: {
                            type: "number",
                            example: 3,
                        },
                        isStock: {
                            type: "boolean",
                            example: false,
                        },
                        note: {
                            type: "string",
                            example: "Updated stock note",
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
                StockIn: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99991",
                        },
                        code: {
                            type: "string",
                            example: "ST2600001",
                        },
                        stockInDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        },
                        product: {
                            $ref: "#/components/schemas/Product",
                        },
                        quantity: {
                            type: "number",
                            example: 10,
                        },
                        note: {
                            type: "string",
                            example: "Initial stock in",
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
                CreateStockInItemRequest: {
                    type: "object",
                    required: ["stockInDate", "product", "quantity"],
                    properties: {
                        stockInDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        },
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        quantity: {
                            type: "number",
                            example: 10,
                        },
                        note: {
                            type: "string",
                            example: "Initial stock in",
                        },
                    },
                },
                CreateStockInRequest: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/CreateStockInItemRequest",
                            },
                        },
                        {
                            type: "object",
                            required: ["items"],
                            properties: {
                                items: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/CreateStockInItemRequest",
                                    },
                                },
                            },
                        },
                    ],
                },
                UpdateStockInRequest: {
                    type: "object",
                    properties: {
                        stockInDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-02",
                        },
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        quantity: {
                            type: "number",
                            example: 15,
                        },
                        note: {
                            type: "string",
                            example: "Updated stock in note",
                        },
                    },
                },
                StockAdjustment: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b99992",
                        },
                        code: {
                            type: "string",
                            example: "STA2600001",
                        },
                        stockAdjustmentDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        },
                        product: {
                            $ref: "#/components/schemas/Product",
                        },
                        quantity: {
                            type: "number",
                            example: 5,
                        },
                        note: {
                            type: "string",
                            example: "Stock adjustment note",
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
                CreateStockAdjustmentItemRequest: {
                    type: "object",
                    required: ["stockAdjustmentDate", "product", "quantity"],
                    properties: {
                        stockAdjustmentDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        },
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        quantity: {
                            type: "number",
                            example: 5,
                        },
                        note: {
                            type: "string",
                            example: "Stock adjustment note",
                        },
                    },
                },
                CreateStockAdjustmentRequest: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/CreateStockAdjustmentItemRequest",
                            },
                        },
                        {
                            type: "object",
                            required: ["items"],
                            properties: {
                                items: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/CreateStockAdjustmentItemRequest",
                                    },
                                },
                            },
                        },
                    ],
                },
                UpdateStockAdjustmentRequest: {
                    type: "object",
                    properties: {
                        stockAdjustmentDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-02",
                        },
                        product: {
                            type: "string",
                            example: "65f1a9f2c1a3a7d9f3b88888",
                        },
                        quantity: {
                            type: "number",
                            example: 8,
                        },
                        note: {
                            type: "string",
                            example: "Updated stock adjustment note",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/**/*.route.ts"],
});
