# RetailHub: Implementation Details

## Pattern Implementation Guide

### 1. Strategy Pattern (CRM Service)
**File**: `crm-service/.../strategy/DiscountStrategy.java`
**Concept**: We defined an interface `DiscountStrategy` and multiple implementations (`FlatDiscountStrategy`, `PercentageDiscountStrategy`).
**Usage**: The `CheckoutService` receives a `discountType` string and purely swaps the strategy object implementation. This allows us to add new discount types (e.g., `BlackFridayStrategy`) without touching the checkout logic.

### 2. State Pattern (OMS Service)
**File**: `oms-service/.../state/OrderContext.java`
**Concept**: The `OrderContext` holds the current state.
**Transitions**:
- `CreatedState` -> Calls `next()` -> Transitions to `PaidState`
- `PaidState` -> Calls `next()` -> Transitions to `ShippedState`
- Calling `new OrderContext()` starts it at `CreatedState`.

### 3. Observer Pattern (System Design)
**Mechanism**: Kafka + Notification Service
**Concept**: The `NotificationService` does not know WHO sent the message. It purely observes the `notification-topic`.
**Trigger**: In a real flow, the OMS would publish `kafkaTemplate.send("notification-topic", "Order #123 Confirmed")`, and the Notification Service would immediately pick it up.

## Running the Project
1. Install **Java 17**, **Maven**, **Node.js**, and **Docker**.
2. Run `start-all.bat`.
3. Open `http://localhost:5173` to view the Dashboard.
