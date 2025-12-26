# 19. Frontend Integration Deep Dive

**Context:** RetailHub (React Storefront)  
**Focus:** Integration State, Auth, Error Handling  
**Role:** Frontend Architect

---

## 1. Executive Overview
The Frontend is the consumer of everything we've built. It must handle **Asynchrony**, **failures**, and **Global State** (User, Cart, Tenant) elegantly. We use **React Query** (Server State) and **Context/Zustand** (Client State) to manage this complexity.

---

## 2. Basics: Core Concepts & Glossary

### 2.1 State Taxonomy
-   **Server State:** Data owned by the server (Orders, Products). It is asynchronous and can be stale. (Tool: `React Query`).
-   **Client State:** Ephemeral UI data (Is Model Open? Form input). (Tool: `useState`, `Zustand`).
-   **Global State:** User Session, Theme. (Tool: `Context`).

### 2.2 BFF (Backend for Frontend)
Ideally, Frontend talks to one API (Gateway or GraphQL). It doesn't aggregate 5 calls manually (that's logic leakage).

---

## 3. Intermediate: Integration Patterns

### 3.1 Auth Flow (JWT)
1.  **Login:** `POST /login` -> Get `accessToken`.
2.  **Storage:** Store in-memory variable (closure). Store refresh token in `HttpOnly` cookie.
3.  **Interceptor:** `Axios` interceptor attaches `Bearer <token>` to requests.
4.  **Refresh:** On `401`, Interceptor pauses requests, hits `/refresh`, updates token, replays failed queue.

### 3.2 Error Handling
-   **Network Error:** Show "You are offline" toaste.
-   **4xx (Bad Request):** Show Form Validation error.
-   **5xx (Server Error):** Show "Oops, try again" (Don't blame user).

---

## 4. Advanced: Optimistic Updates

### 4.1 "Snappy" UI
**Scenario:** User clicks "Like Product".
-   **Standard:** Loading Spinner -> Wait API -> Update Icon. (Slow).
-   **Optimistic:** Update Icon immediately -> Call API.
    -   *If Success:* Do nothing (Synced).
    -   *If Fail:* Revert Icon & Show Error.

---

## 5. Architecture Visuals

### 5.1 React Structure
```mermaid
graph TD
    App --> AuthProvider
    AuthProvider --> TenantProvider
    TenantProvider --> QueryClientProvider
    
    QueryClientProvider --> Router
    Router --> Page[Product Page]
    
    Page -->|React Query| Hook[useProduct(id)]
    Hook -->|Axios| API[API Gateway]
```

---

## 6. Code & Config Examples

### 6.1 React Query Hook
```javascript
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (order) => axios.post('/api/orders', order),
    onSuccess: () => {
      // Invalidate cache to trigger refetch
      queryClient.invalidateQueries(['orders']);
      toast.success("Order Placed!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed");
    }
  });
};
```

### 6.2 Axios Interceptor
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await axios.post('/auth/refresh');
      api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Operational Playbook

### 7.1 "White Screen of Death"
-   **Cause:** Uncaught JS error.
-   **Fix:** **Error Boundaries**.
    -   Wrap App in `<ErrorBoundary>`.
    -   Log error to Sentry/LogRocket.
    -   Show "Something went wrong" fallback UI.

---

## 8. Security & Compliance Notes

-   **XSS:** Never use `dangerouslySetInnerHTML`.
-   **Dependencies:** `npm audits`. Frontend chains are notoriously vulnerable.
-   **CSP:** Ensure `index.html` has meta tags preventing loading scripts from random domains.

---

## 9. Interview Prep

### 9.1 Common Questions
1.  **Q:** Prop Drilling?
    -   *A:* Passing data down 5 layers. Fix using Composition or Context.
2.  **Q:** Virtual DOM?
    -   *A:* In-memory representation. React diffs it with real DOM to minimize paint operations.

### 9.2 Whiteboard Prompt
*"Design an infinite scroll feed component."*
-   **Solution:** use `IntersectionObserver` to detect "bottom of page", trigger `fetchNextPage()` from React Query.

---

## 10. Practice Exercises

1.  **Basic:** Build a form with Formik/Yup validation.
2.  **Intermediate:** Implement the "Optimistic Like" button.
3.  **Advanced:** Create a custom hook `useAuth()` that handles the entire Login/Refresh lifecycle.

---

## 11. Checklists

### Frontend Launch
- [ ] **Bundle Size:** Is it optimized? (Code Splitting).
- [ ] **Accessibility:** Do images have `alt` tags? Is keyboard nav working?
- [ ] **Lighthouse:** Score > 90?

---

## 12. References
-   *React Docs (Beta/New)*
-   *TanStack Query Docs*
