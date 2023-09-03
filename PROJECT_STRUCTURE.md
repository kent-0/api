## `database/`

The `database/` folder contains configuration, entities, migrations, and seeds related to the database.

- `entities/`: Contains database entities organized into subfolders by context (e.g., `auth/`, `board/`, `project/`).

- `enums/`: Contains enumerations used in the database.

- `migrations/`: Contains database migrations.

- `seeds/`: Contains seeders to populate the database with initial data.

## `modules/`

The `modules/` folder contains application modules, organized into subfolders by context (e.g., `auth/`).

- `decorators/`: Contains decorators used in the module.

- `guards/`: Contains guards used to protect routes and functions in the module.

- `inputs/`: Contains input objects used in module operations.

- `interfaces/`: Contains interfaces used in the module.

- `objects/`: Contains GraphQL objects used to represent data in the module.

- `services/`: Contains business logic and services related to the module.

- `strategy/`: Contains authentication strategies used in the module.

## `permissions/`

The `permissions/` folder contains logic related to permission management and authorization in the application.

- `enums/`: Contains enumerations used to define permissions.

- `services/`: Contains services and logic related to permission management and authorization.

This structure provides a solid foundation for developing and expanding the application in the future, enabling modular and scalable organization.
