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

  %% User Actions
  User -- Browse Products --> BP[Browse Products]
  User -- Search Products --> SP[Search Products]
  User -- Place Order --> PO[Place Order]
  User -- View Rent Product --> RP[View Rent Product]
  User -- Write Review --> WR[Write Review]
  User -- View Profile --> VP[View Profile]

  %% Staff Actions
  Staff -- Add/Update Products --> AUP[Add/Update Products]
  Staff -- Add/Update Rentals --> AUR[Add/Update Rentals]
  Staff -- Manage Orders --> MO[Manage Orders]
  Staff -- Manage Suppliers --> MS[Manage Suppliers]
  Staff -- View Dashboard --> VD[View Dashboard]
  Staff -- Generate Reports --> GR[Generate Reports]

  %% Admin Actions
  Admin -- All Staff Use Cases --> Staff
  Admin -- Manage Users --> MU[Manage Users]
  Admin -- Moderate Reviews --> MR[Moderate Reviews]
  Admin -- View Sales/Rental Reports --> SRR[View Sales/Rental Reports]
```

---

## Sequence Diagram: For overall
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Staff
    participant Admin

    %% Registration & Login
    User->>Frontend: Register/Login
    Frontend->>Backend API: Submit credentials
    Backend API-->>Frontend: Auth success/failure
    Frontend-->>User: Show login status

    %% Product Browsing & Search
    User->>Frontend: Browse/Search Products
    Frontend->>Backend API: Request product list
    Backend API-->>Frontend: Return product list
    Frontend-->>User: Display products

    %% View Rental Tools & Check Availability
    User->>Frontend: View Rental Tools
    Frontend->>Backend API: Request rental tools
    Backend API-->>Frontend: Return rental tools
    User->>Frontend: Check Tool Availability
    Frontend->>Backend API: Query availability
    Backend API-->>Frontend: Return availability info
    Frontend-->>User: Display availability

    Note over User, Staff: If available, user contacts staff via call/message to rent

    %% Cart Management & Order
    User->>Frontend: Add to Cart
    Frontend->>Backend API: Update cart
    User->>Frontend: Checkout
    Frontend->>Backend API: Submit order
    Backend API-->>Frontend: Return order confirmation
    Backend API->>Staff: Notify new order

    %% Review & Profile
    User->>Frontend: Submit Review / View Profile
    Frontend->>Backend API: Post review / Fetch profile
    Backend API-->>Frontend: Success/Fail
    Frontend-->>User: Display status

    %% Staff & Admin Actions
    Staff->>Backend API: Manage Products/Rentals
    Staff->>Backend API: Update Inventory/Orders
    Admin->>Backend API: Manage Users
    Admin->>Backend API: Moderate Reviews
    Admin->>Backend API: View Sales/Rental Reports
```

---

## ER Diagram

```mermaid
erDiagram
    USERS {
      int id PK
      string name
      string email
      string password
      string phone
      string role
      datetime created_at
    }

    ADDRESSES {
      int id PK
      int user_id FK
      string street
      string city
      string district
      string province
      string zip_code
      string address_type
    }

    SUPPLIERS {
      int id PK
      string name
      string contact_info
      string address
    }

    PRODUCTS {
      int id PK
      string name
      string description
      float price
      int stock
      int supplier_id FK
      datetime created_at
    }

    ORDERS {
      int id PK
      int user_id FK
      int address_id FK
      float total
      string status
      datetime created_at
    }

    ORDER_ITEMS {
      int id PK
      int order_id FK
      int product_id FK
      int quantity
      float price
    }

    CARTS {
      int id PK
      int user_id FK
      datetime created_at
    }

    CART_ITEMS {
      int id PK
      int cart_id FK
      int product_id FK
      int quantity
    }

    REVIEWS {
      int id PK
      int user_id FK
      int product_id FK
      int rating
      string comment
      datetime created_at
    }

    USERS ||--o{ ADDRESSES : has
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : owns
    USERS ||--o{ REVIEWS : writes
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : part_of
    CARTS ||--o{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : added
    PRODUCTS ||--o{ REVIEWS : reviewed
    SUPPLIERS ||--o{ PRODUCTS : supplies
    ORDERS ||--|| ADDRESSES : delivers_to
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
