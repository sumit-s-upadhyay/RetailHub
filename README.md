# 🛍️ RetailHub - Enterprise E-Commerce Microservices Platform

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-grade microservices architecture demonstrating advanced Object-Oriented Design patterns, distributed systems concepts, and full-stack development best practices.

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Design Patterns](#design-patterns)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

RetailHub is not just another e-commerce platform—it's a comprehensive learning project designed to master enterprise-level software development. The system implements a **multi-role workflow** (Customer, CSR, Logistics) with stateful order management, digital wallet payments, and event-driven architecture.

### Key Highlights
- ✅ **5 Independent Microservices** with clear bounded contexts
- ✅ **State Pattern** for complex order lifecycle management
- ✅ **Strategy Pattern** for pluggable payment methods
- ✅ **Event-Driven Architecture** using Apache Kafka
- ✅ **Digital Wallet System** with transaction history
- ✅ **Role-Based Access Control** (RBAC)
- ✅ **Real-time UI Updates** with polling mechanism

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│                        Port 5173                             │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐      ┌──────────┐      ┌──────────┐
│  CRM   │      │   OMS    │◄─────┤Inventory│      │ Payment  │
│ :8081  │      │  :8082   │      │  :8085   │      │  :8084   │
└────────┘      └────┬─────┘      └──────────┘      └──────────┘
                     │
                     │ Async Events
                     ▼
              ┌─────────────┐
              │    Kafka    │
              │    :9092    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │Notification │
              │    :8086    │
              └─────────────┘
```

### Service Responsibilities

| Service | Purpose | Database | Key Patterns |
|---------|---------|----------|--------------|
| **CRM** | User authentication & authorization | H2 | Repository |
| **OMS** | Order lifecycle orchestration | H2 | State, Orchestrator |
| **Inventory** | Product catalog & stock management | H2 | Chain of Responsibility |
| **Payment** | Digital wallet & transactions | H2 | Strategy, Adapter |
| **Notification** | Asynchronous event processing | - | Observer (Kafka) |

## ✨ Features

### For Customers
- 🛒 Browse product catalog with real-time stock levels
- 💳 Digital wallet with $1000 sign-up bonus
- 📦 Track order status (Created → Approved → Paid → Shipped)
- 💰 Add funds to wallet
- 📱 Responsive UI with smooth animations

### For CSR Agents
- ✅ Review and approve pending orders
- 📊 Real-time approval queue with auto-refresh
- 🔍 Inventory verification before approval
- 📈 Dashboard with order statistics

### For Logistics
- 🚚 View paid orders ready for shipment
- 📦 Mark orders as shipped
- 🔄 Real-time shipping queue updates

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **ORM**: Spring Data JPA / Hibernate
- **Database**: H2 (In-Memory), MySQL (Docker)
- **Messaging**: Apache Kafka + Zookeeper
- **Security**: Spring Security
- **Build Tool**: Maven 3.9.6

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### DevOps
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Custom PowerShell scripts
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Docker Desktop (running)
- Maven 3.9+ (included in `.tools/`)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/RetailHub.git
cd RetailHub
```

2. **Start the entire system**
```bash
# Windows
./start-all.bat

# Linux/Mac
./start-all.sh
```

This will:
- Start Docker containers (MySQL, Kafka, Zookeeper)
- Launch 5 Spring Boot microservices in background
- Start React frontend on http://localhost:5173

3. **Access the application**
- **Frontend**: http://localhost:5173
- **CRM Service**: http://localhost:8081
- **OMS Service**: http://localhost:8082
- **Payment Service**: http://localhost:8084
- **Inventory Service**: http://localhost:8085

### Quick Demo

1. **Register a new user**
   - Click "Register" tab
   - Enter username: `alice`, password: `123`
   - You'll receive $1000 in your wallet automatically

2. **Place an order**
   - Browse products
   - Click "Buy" on iPhone 15 ($999)
   - Order status: `CREATED` (Waiting for Approval)

3. **Approve as CSR**
   - Logout
   - Click "CSR Agent" quick link
   - Approve the pending order
   - Stock will be reserved

4. **Pay for order**
   - Login as `alice` again
   - Click "Pay" on the approved order
   - Wallet balance: $1000 → $1

5. **Ship the order**
   - Logout
   - Click "Logistics" quick link
   - Mark order as "Shipped"

### Stopping the System
```bash
./stop-all.bat
```

## 📁 Project Structure

```
RetailHub/
├── crm-service/              # User authentication & management
│   ├── src/main/java/com/retailhub/crm/
│   │   ├── controller/       # REST endpoints
│   │   ├── model/            # JPA entities
│   │   ├── repository/       # Data access layer
│   │   └── config/           # Spring Security config
│   └── pom.xml
├── oms-service/              # Order management
│   ├── src/main/java/com/retailhub/oms/
│   │   ├── controller/       # Order APIs
│   │   ├── model/            # Order entity
│   │   ├── state/            # State Pattern implementation
│   │   └── service/          # Orchestrator service
│   └── pom.xml
├── payment-service/          # Wallet & transactions
│   ├── src/main/java/com/retailhub/payment/
│   │   ├── controller/       # Payment APIs
│   │   ├── model/            # Wallet, PaymentRecord
│   │   ├── adapter/          # Strategy Pattern (PayPal, Stripe)
│   │   └── repository/
│   └── pom.xml
├── inventory-service/        # Product catalog
│   ├── src/main/java/com/retailhub/inventory/
│   │   ├── controller/       # Product APIs
│   │   ├── model/            # Product entity
│   │   └── chain/            # Chain of Responsibility
│   └── pom.xml
├── notification-service/     # Event consumer
│   ├── src/main/java/com/retailhub/notification/
│   │   └── consumer/         # Kafka listeners
│   └── pom.xml
├── retail-client/            # React frontend
│   ├── src/
│   │   ├── sections/         # Page components
│   │   ├── App.jsx           # Main router
│   │   └── index.css         # Global styles
│   └── package.json
├── docker-compose.yml        # Infrastructure setup
├── start-all.bat             # Unified startup script
├── stop-all.bat              # Shutdown script
└── RetailHub_Documentation.md # Comprehensive technical docs
```

## 📚 API Documentation

### OMS Service (Port 8082)

#### Customer Endpoints
```http
POST /api/oms/create?sku={sku}&qty={qty}&customer={username}
GET  /api/oms/my-orders?customer={username}
POST /api/oms/{orderId}/pay
```

#### CSR Endpoints
```http
GET  /api/oms/pending
POST /api/oms/{orderId}/approve
```

#### Logistics Endpoints
```http
GET  /api/oms/paid
POST /api/oms/{orderId}/ship
```

### Payment Service (Port 8084)
```http
POST /api/payment/wallet/create?username={username}&initialAmount={amount}
GET  /api/payment/wallet/balance?username={username}
POST /api/payment/wallet/add?username={username}&amount={amount}
POST /api/payment/pay?type={wallet|paypal}&accountId={username}&amount={amount}
```

### Inventory Service (Port 8085)
```http
GET /api/inventory/products
GET /api/inventory/check?sku={sku}&qty={qty}
```

### CRM Service (Port 8081)
```http
POST /api/auth/register?username={username}&password={password}
POST /api/auth/login?username={username}&password={password}
```

## 🎨 Design Patterns

### 1. State Pattern
**Location**: `oms-service/src/main/java/com/retailhub/oms/state/`

Manages order lifecycle transitions without conditional logic.

```java
OrderContext → CreatedState → PaidState → ShippedState
```

### 2. Strategy Pattern
**Location**: `payment-service/src/main/java/com/retailhub/payment/adapter/`

Enables runtime selection of payment algorithms.

```java
PaymentProcessor ← PayPalAdapter
                 ← StripeAdapter
                 ← WalletProcessor
```

### 3. Repository Pattern
**Location**: All services (`*/repository/`)

Abstracts data access layer from business logic.

### 4. Orchestrator Pattern
**Location**: `oms-service/src/main/java/com/retailhub/oms/service/OrchestratorService.java`

Coordinates inter-service communication.

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific service tests
cd oms-service && mvn test

# Frontend tests
cd retail-client && npm test
```

## 📖 Learning Resources

For in-depth understanding of the architecture, design decisions, and interview preparation, refer to:
- **[RetailHub_Documentation.md](RetailHub_Documentation.md)** - Complete technical guide

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React community for the robust ecosystem
- Apache Kafka for reliable messaging
- All open-source contributors

## 📧 Contact

For questions or feedback, please reach out:
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

**⭐ If you found this project helpful, please give it a star!**

Built with ❤️ for learning and demonstration purposes.
