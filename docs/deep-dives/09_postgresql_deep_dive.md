# 09. PostgreSQL Deep Dive

**Context:** RetailHub (Primary System of Record)  
**Focus:** Schema Design, Indexing, Partitioning, JSONB  
**Role:** Database Administrator / Backend Engineer

---

## 1. Executive Overview
PostgreSQL is the "Source of Truth" for RetailHub. Unlike Redis (Cache) or Kafka (Log), Postgres stores the permanent state of Users, Orders, and Finances. Its reliability (ACID compliance) and versatility (JSON support) make it the backbone of our data layer.

---

## 2. Basics: Core Concepts & Glossary

### 2.1 MVCC (Multi-Version Concurrency Control)
Postgress doesn't lock rows for reading.
-   **Readers don't block Writers.**
-   **Writers don't block Readers.**
-   How: It keeps multiple versions of a row (tuples). Old versions are cleaned up by **VACUUM**.

### 2.2 Data Types
-   `UUID`: Standard specific for Primary Keys (Distributed safe).
-   `JSONB`: Binary JSON. Indexable. (Used for Product Attributes).
-   `TIMESTAMPTZ`: Always use "Aware" timestamps (UTC).

---

## 3. Intermediate: Designing for Retail

### 3.1 Schema Design
**Tenant Isolation:**
-   **Option A:** Schema per Tenant (`tenant_a.orders`, `tenant_b.orders`). Good for complete isolation. Hard to migrate.
-   **Option B:** Discriminator Column (`table.tenant_id`). Good for scaling to 10k tenants. (RetailHub Choice).

### 3.2 Indexing Strategy
-   **B-Tree:** Default. Good for equality (`=`) and range (`<`, `>`).
    -   *Use:* `user_id`, `created_at`.
-   **GIN (Generalized Inverted Index):**
    -   *Use:* Inside `product_attributes` JSONB column. Queries like "Find all phones with color=red".

---

## 4. Advanced: Performance at Scale

### 4.1 Partitioning
**Scenario:** `orders` table has 100 Million rows. Index scan is slow.
-   **Declarative Partitioning:** Split by Range (Date).
-   `orders_y2024_m01`, `orders_y2024_m02`.
-   App queries transparently: `SELECT * FROM orders WHERE date ...`. PG routes to correct child table.

### 4.2 Connection Pooling (PgBouncer)
Spring Boot opens 10 connections per pod. 100 pods = 1000 connections.
-   **Risk:** PG runs out of RAM (each connection ~10MB).
-   **Solution:** Use PgBouncer in front of PG to multiplex connections.

---

## 5. Architecture Visuals

### 5.1 Partitioning Layout
```mermaid
graph TD
    App[Application] -->|INSERT date=2024-01-15| Parent[Table: Orders]
    Parent -->|Routes to| P1[Partition: orders_jan24]
    Parent -->|Routes to| P2[Partition: orders_feb24]
    
    note right of Parent: "Virtual" Table
    note right of P1: Physical Storage
```

---

## 6. Code & Config Examples

### 6.1 Creating a Partitioned Table
```sql
CREATE TABLE orders (
    id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    total DECIMAL(10,2),
    status TEXT
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2025_01 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### 6.2 JSONB Querying
```sql
-- Find products where attributes->color is 'red'
SELECT * FROM products 
WHERE attributes @> '{"color": "red"}';

-- Create Index for speed
CREATE INDEX idx_products_attrs ON products USING GIN (attributes);
```

---

## 7. Operational Playbook

### 7.1 Slow Query Analysis
-   **Tool:** `pg_stat_statements`.
-   **Action:**
    1.  List top 5 queries by `total_time`.
    2.  Run `EXPLAIN ANALYZE` on them.
    3.  Check for `Seq Scan` (Table Scan).
    4.  Add Index.

### 7.2 Bloat
-   **Symptom:** Disk space used > Data size.
-   **Cause:** Dead tuples not removed.
-   **Fix:** Tune autovacuum settings.

---

## 8. Security & Compliance Notes

-   **Row Level Security (RLS):**
    -   Postgres feature to enforce `tenant_id` check at Database level!
    -   `CREATE POLICY tenant_isolation ON orders USING (tenant_id = current_setting('app.current_tenant'));`
-   **Encryption at Rest:** Enable tablespace encryption or volume encryption (AWS EBS).

---

## 9. Interview Prep

### 9.1 Common Questions
1.  **Q:** ACID properties?
    -   *A:* Atomicity (All/None), Consistency (Rules valid), Isolation (Tx don't interfere), Durability (Saved to disk).
2.  **Q:** Indexing tradeoff?
    -   *A:* Faster Reads, Slower Writes (Update index on every insert). Disk Space usage.

### 9.2 Whiteboard Prompt
*"Design the database schema for a threaded comment system (Reddit style)."*
-   **Solution:**
    -   `id`, `parent_id`, `content`.
    -   Recursive CTE (Common Table Expression) to fetch tree.
    -   Or `ltree` extension for path enumeration.

---

## 10. Practice Exercises

1.  **Basic:** Write a SQL migration (Flyway) to add a `status` column to `users` table.
2.  **Intermediate:** Use `EXPLAIN` to optimize a query joining 3 tables.
3.  **Advanced:** Implement **Row Level Security** policy so a DB user `reporting_user` can only see data from 'NY' region.

---

## 11. Checklists

### Production Launch
- [ ] **Backups:** Is WAL archiving (Point-in-Time Recovery) enabled?
- [ ] **Connection Pool:** Is HikariCP configured correctly in Spring?
- [ ] **Users:** Is the App using a specific user (not `postgres` superuser)?

---

## 12. Expert Corner: Battle-Tested Nuances

### 12.1 Partial Indexes
Don't index everything.
-   **Scenario:** You often query `SELECT * FROM orders WHERE status = 'PENDING'`. (But 99% of orders are `COMPLETED`).
-   **Optimization:** `CREATE INDEX idx_pending ON orders (created_at) WHERE status = 'PENDING';`
-   **Benefit:** Index size is tiny (only 1% of rows). Queries for pending orders are lightning fast.

### 12.2 Transaction ID Wraparound
-   **The Nightmare:** PostgreSQL uses a 32-bit counter for transactions (XID). If it wraps around (~4 Billion), old data becomes invisible.
-   **Defense:** Ensure `autovacuum` is running. It "freezes" old rows (Resetting their XID age). Monitor `age(datfrozenxid)`.

## 13. References
-   *PostgreSQL Official Documentation*
-   *The Art of PostgreSQL*
