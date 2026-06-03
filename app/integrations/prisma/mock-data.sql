BEGIN TRANSACTION;

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

DELETE FROM "Token"
WHERE "userId" IN (
    SELECT "id" FROM "User"
    WHERE "username" IN ('ana.ventas', 'bruno.comercial', 'carla.vendedora')
);

DELETE FROM "_RolesToUser"
WHERE "A" IN (
    SELECT "id" FROM "Roles"
    WHERE "name" IN (
        'venta_admin',
        'venta_manager',
        'venta_vendedor',
        'comercial_admin',
        'comercial_manager',
        'comercial_analista'
    )
)
OR "B" IN (
    SELECT "id" FROM "User"
    WHERE "username" IN ('ana.ventas', 'bruno.comercial', 'carla.vendedora')
);

DELETE FROM "RolePermission"
WHERE "roleId" IN (
    SELECT "id" FROM "Roles"
    WHERE "name" IN (
        'venta_admin',
        'venta_manager',
        'venta_vendedor',
        'comercial_admin',
        'comercial_manager',
        'comercial_analista'
    )
)
OR "permissionId" IN (
    SELECT "id" FROM "Permission"
    WHERE "name" IN (
        'ventas_clientes',
        'ventas_oportunidades',
        'ventas_pedidos',
        'comercial_campanias',
        'comercial_cotizaciones',
        'comercial_reportes'
    )
);

DELETE FROM "Operation"
WHERE "name" IN (
    'ventas_clientes_crud',
    'ventas_oportunidades_crud',
    'ventas_pedidos_read_update',
    'comercial_campanias_crud',
    'comercial_cotizaciones_crud',
    'comercial_reportes_read'
);

DELETE FROM "Permission"
WHERE "name" IN (
    'ventas_clientes',
    'ventas_oportunidades',
    'ventas_pedidos',
    'comercial_campanias',
    'comercial_cotizaciones',
    'comercial_reportes'
);

DELETE FROM "Roles"
WHERE "name" IN (
    'venta_admin',
    'venta_manager',
    'venta_vendedor',
    'comercial_admin',
    'comercial_manager',
    'comercial_analista'
);

DELETE FROM "User"
WHERE "username" IN ('ana.ventas', 'bruno.comercial', 'carla.vendedora');

INSERT INTO "User" ("username", "firstName", "lastName", "password", "age", "nationality", "updatedAt") VALUES
('ana.ventas', 'Ana', 'Ventas', '$2b$10$rA6C9ATp1thQDyZ1h1ui6ekOEgzWb.JWAvUqU9B.l3sBUxyWeRFEq', 34, 'AR', CURRENT_TIMESTAMP),
('bruno.comercial', 'Bruno', 'Comercial', '$2b$10$rA6C9ATp1thQDyZ1h1ui6ekOEgzWb.JWAvUqU9B.l3sBUxyWeRFEq', 41, 'AR', CURRENT_TIMESTAMP),
('carla.vendedora', 'Carla', 'Vendedora', '$2b$10$rA6C9ATp1thQDyZ1h1ui6ekOEgzWb.JWAvUqU9B.l3sBUxyWeRFEq', 29, 'UY', CURRENT_TIMESTAMP);

INSERT INTO "Roles" ("name", "scope") VALUES
('venta_admin', 'ALL'),
('venta_manager', 'ADMIN'),
('venta_vendedor', 'API'),
('comercial_admin', 'ALL'),
('comercial_manager', 'ADMIN'),
('comercial_analista', 'API');

INSERT INTO "Permission" ("name", "scope") VALUES
('ventas_clientes', 'ALL'),
('ventas_oportunidades', 'ALL'),
('ventas_pedidos', 'API'),
('comercial_campanias', 'ALL'),
('comercial_cotizaciones', 'ALL'),
('comercial_reportes', 'API');

INSERT INTO "Operation" ("label", "name", "tool", "operation", "permissionId", "permisosId") VALUES
('Gestionar clientes de ventas', 'ventas_clientes_crud', 'ventas-clientes', '["CREATE","READ","UPDATE","DELETE"]', (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_clientes' LIMIT 1), NULL),
('Gestionar oportunidades de ventas', 'ventas_oportunidades_crud', 'ventas-oportunidades', '["CREATE","READ","UPDATE","DELETE"]', (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_oportunidades' LIMIT 1), NULL),
('Consultar y actualizar pedidos', 'ventas_pedidos_read_update', 'ventas-pedidos', '["READ","UPDATE"]', (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_pedidos' LIMIT 1), NULL),
('Gestionar campanias comerciales', 'comercial_campanias_crud', 'comercial-campanias', '["CREATE","READ","UPDATE","DELETE"]', (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_campanias' LIMIT 1), NULL),
('Gestionar cotizaciones comerciales', 'comercial_cotizaciones_crud', 'comercial-cotizaciones', '["CREATE","READ","UPDATE","DELETE"]', (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_cotizaciones' LIMIT 1), NULL),
('Consultar reportes comerciales', 'comercial_reportes_read', 'comercial-reportes', '["READ"]', (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_reportes' LIMIT 1), NULL);

INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_clientes' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_oportunidades' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_pedidos' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_manager' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_oportunidades' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_manager' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_pedidos' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_vendedor' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_clientes' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_vendedor' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'ventas_pedidos' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_campanias' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_cotizaciones' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_admin' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_reportes' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_manager' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_cotizaciones' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_manager' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_reportes' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_analista' LIMIT 1), (SELECT "id" FROM "Permission" WHERE "name" = 'comercial_reportes' LIMIT 1));

INSERT INTO "_RolesToUser" ("A", "B") VALUES
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_admin' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'ana.ventas' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_manager' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'ana.ventas' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_admin' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'bruno.comercial' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_manager' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'bruno.comercial' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'venta_vendedor' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'carla.vendedora' LIMIT 1)),
((SELECT "id" FROM "Roles" WHERE "name" = 'comercial_analista' LIMIT 1), (SELECT "id" FROM "User" WHERE "username" = 'carla.vendedora' LIMIT 1));

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

COMMIT;
