# Thangam-Server — Backend Documentation

## Overview

**Thangam-Server** is the backend REST API for Thangam, a platform for renting and selling gardening tools and fertilizers. It powers the Thangam-Client frontend and handles all business logic, authentication, authorization, data persistence, and communication with the database.

---

## Features

- **User Management**: Authentication (JWT), registration, roles (admin, staff, user)
- **Product Management**: CRUD for products (tools and fertilizers), categories, inventory
- **Rental Management**: Rental products, rental orders, availability tracking
- **Order Management**: Handle purchase and rental orders, status updates, payment integration (if any)
- **Supplier Management**: Manage supplier data and relations to products
- **Review System**: Users can leave reviews on products, admins moderate
- **Dashboard & Reporting**: Sales, rentals, user and inventory statistics (for admin/staff)
- **Role-Based Access Control**: Secure endpoints for different user roles

---

## Use Case Diagram

```mermaid
graph TD
  User((User))
  Staff((Staff))
  Admin((Admin))

  User -- Register/Login --> A[Authenticate]
  User -- View Products --> B[View Catalog]
  User -- Place Order --> C[Order Product]
  User -- Rent Tool --> D[Rent Product]
  User -- Write Review --> E[Submit Review]

  Staff -- Manage Products --> F[CRUD Products]
  Staff -- Manage Rentals --> G[CRUD Rentals]
  Staff -- Manage Orders --> H[Process Orders]
  Staff -- Manage Suppliers --> I[CRUD Suppliers]
  Staff -- View Reports --> J[View Dashboard]

  Admin -- All Staff Actions --> Staff
  Admin -- Manage Users --> K[User Management]
  Admin -- Moderate Reviews --> L[Moderate Reviews]
  Admin -- View Reports --> J
```

---

## Sequence Diagram: Placing a Rental Order

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB

    User->>Frontend: Selects rental product, fills form
    Frontend->>Backend: POST /api/rentals (order data)
    Backend->>DB: Validate & save rental order
    DB-->>Backend: Confirmation
    Backend-->>Frontend: Order confirmation response
    Frontend-->>User: Show success message
```

---

## ER Diagram

```mermaid
erDiagram
    USER {
      int id PK
      string name
      string email
      string password
      string role
      string phone
    }
    PRODUCT {
      int id PK
      string name
      string category
      string description
      float price
      int supplier_id FK
      bool is_rental
      int stock
    }
    SUPPLIER {
      int id PK
      string name
      string brand
      string contact
    }
    ORDER {
      int id PK
      int user_id FK
      int product_id FK
      int quantity
      float total
      string type
      date order_date
      string status
    }
    REVIEW {
      int id PK
      int user_id FK
      int product_id FK
      int rating
      string comment
      date date
    }

    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    PRODUCT ||--o{ ORDER : included_in
    PRODUCT ||--o{ REVIEW : reviewed
    SUPPLIER ||--o{ PRODUCT : supplies
```

---

## API Structure Example

- `/api/auth` — Authentication routes (login, register)
- `/api/users` — User management (CRUD, profile, roles)
- `/api/products` — Product CRUD
- `/api/rentals` — Rental product and order management
- `/api/orders` — Purchase order management
- `/api/suppliers` — Supplier CRUD
- `/api/reviews` — Product reviews
- `/api/dashboard` — Admin/staff reporting

---

## Technologies Used

- Node.js, Express.js
- Database: (e.g., MongoDB, MySQL, PostgreSQL — specify your DB)
- JWT for authentication
- RESTful API design
- Middleware for validation and security

---

## Setup & Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/Mathura-skr/Thangam-Server.git
   cd Thangam-Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`.env` file):
   - Database URI
   - JWT secret
   - Other configs as required

4. Start the server:
   ```bash
   npm start
   ```

---
