# TradeNest Read-Only Analysis Report

This analysis confirms the exact behavior, schemas, and configurations of the existing Spring Boot backend. This document serves as the foundation for the .NET backend implementation, ensuring perfect compatibility with the existing frontend and database.

## 1. Existing Spring Services & Endpoints
- **User Service (8080/api/users)**
  - `POST /register`: Registers user, returns `UserResponse`
  - `POST /login`: Authenticates, returns `LoginResponse` (with JWT)
  - `GET /{uid}`, `GET /`, `PUT /{uid}`, `DELETE /{uid}`
  - `GET /search?uname=...`
  - `GET /count`
- **Product Service (8080/api/products & /api/categories & /api/images & /api/rent)**
  - `POST /`, `GET /{pid}`, `GET /`, `PUT /{pid}`, `DELETE /{pid}`
  - `GET /category/{cid}`, `GET /seller/{uid}`, `GET /type/{type}`, `GET /search?keyword=...`
  - `GET /count`
  - Categories: `POST /api/categories`, `GET`, `PUT`, `DELETE`
  - Images: `POST /api/images` (upload), `GET /product/{pid}`, `DELETE /{imageId}`
  - Rent: `POST /api/rent`, `GET /product/{pid}`, `DELETE /{prid}`
- **Order Service (8080/api/purchases & /api/rentals & /api/payments)**
  - Purchases: `POST /`, `GET /{id}`, `GET /`, `GET /buyer/{id}`, `GET /seller/{id}`, `DELETE /{id}`, `GET /count`
  - Rentals: `POST /`, `GET /{id}`, `GET /`, `GET /owner/{id}`, `GET /renter/{id}`, `PUT /status`, `DELETE /{id}`
- **AI Service (8080/api/ai)**
  - `POST /recommend`: Accepts `{ "query": "..." }`, returns product recommendations using Gemini API.

## 2. Database Tables & Entity Mappings
The database is `tradenestdb` in MySQL. EF Core will be mapped exactly to these tables without any migrations.

| Spring Entity | Mapped Table | Primary Key | Foreign Keys & Notes |
|---|---|---|---|
| `User` | `users` | `uid` (INT, auto) | `rid` -> `roles(rid)`. Has `uname`, `password`, `email`, `contactnumber`, `status`. |
| `Role` | `roles` | `rid` (INT, auto) | `rname` (String) |
| `Product` | `products` | `pid` (INT, auto) | `uid` (User), `cid` -> `categories(cid)`. `status` (Enum: AVAILABLE, SOLD, RENTED, INACTIVE), `type` (Enum) |
| `Category` | `categories` | `cid` (INT, auto) | `cname`, `description` |
| `ProductImage` | `product_images` (approx) | `imageId` | `pid` -> `products(pid)`. Stores `imageUrl` (UUID filename), `isPrimary`. |
| `Purchase` | `purchases` | `purchase_id` | `pid`, `buyer_id`, `seller_id`. `status` (Enum: PENDING, COMPLETED, CANCELLED). |
| `RentalTransaction` | `rental_transactions` | `rental_id` | Similar to purchase |

*EF Core DB Contexts will be restricted to their respective microservices. For example, `UserServiceContext` will only include `User` and `Role`.*

## 3. JWT & Authentication Flow
- **Algorithm**: `HS256`
- **Secret**: Loaded from application properties (`jwt.secret`). Will use the same secret in .NET.
- **Subject Claim**: Spring sets the `sub` claim to the user's `email`.
- **Validation**: Verifies the signature and checks expiration.
- **Action**: .NET will use `Microsoft.AspNetCore.Authentication.JwtBearer` configured with `TokenValidationParameters` validating the `IssuerSigningKey` (the base64 decoded secret used by Spring) and mapping the `sub` claim properly.

## 4. Product Purchase Flow & Status
When a purchase is created:
1. `POST /api/purchases` receives `PurchaseRequest`.
2. A `Purchase` record is created.
3. The `Product` status transitions from `AVAILABLE` to `SOLD` upon successful completion.
4. Business rule: If a product is already `SOLD` or `INACTIVE`, it cannot be purchased (returns `409 Conflict`).
5. Product records are **NEVER deleted** upon purchase.

## 5. AI Service Flow
- Endpoint: `POST /api/ai/recommend`
- Process: The service fetches all products with `status = AVAILABLE`. It builds a prompt appending the user's string and sends it to the Gemini REST API (or SDK).
- Response: A structured JSON containing matched `productId`s and reasons.
- Action: Will use the `GEMINI_API_KEY` env var and `HttpClient` in C# to call the Gemini API, maintaining the same prompt rules and output schema.

## 6. Image Handling Flow
- **Spring Implementation**: Uploads are saved to relative path `"uploads/products/"`. If started from `backend/product-service/`, files go to `backend/product-service/uploads/products/`.
- **Database**: Stores just the UUID filename (e.g. `1234-5678.jpg`).
- **.NET Action**: The `.NET` ProductService will be configured with a physical file provider that serves static files directly from `../backend/product-service/uploads/products/` to ensure no images are lost or duplicated, and the frontend gets the same images.

## 7. Frontend API Dependencies
The React frontend uses `axiosInstance` which relies on `BASE_URL = "http://localhost:8080/api/..."`.
- **Action**: Modify `frontend/src/api/authApi.js`, `userApi.js`, etc., to use Vite env variables:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/users";
```
We will introduce `.env.spring` (`VITE_API_BASE_URL=http://localhost:8080/api`) and `.env.dotnet` (`VITE_API_BASE_URL=http://localhost:5000/api`) and configure Vite modes. No UI/JSX components will be modified.

## 8. Git Safety
Confirmed working directory is clean (`git status` shows nothing to commit). No Spring files will be touched. All .NET work will be strictly confined to `backend-dotnet/`.
