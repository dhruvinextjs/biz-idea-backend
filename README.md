# 🚀 BizIdeas Backend — Complete Documentation

## 🏗️ Architecture: 2 Separate Auth Systems

```
┌─────────────────────────────────────────────────────────┐
│                    BIZIDEAS BACKEND                      │
│                                                         │
│  ┌─────────────────────┐   ┌─────────────────────────┐  │
│  │     USER AUTH       │   │      ADMIN AUTH          │  │
│  │  Model: User.js     │   │  Model: Admin.js         │  │
│  │  JWT_USER_SECRET    │   │  JWT_ADMIN_SECRET        │  │
│  │  /api/auth/*        │   │  /api/admin/*            │  │
│  │                     │   │  + EJS Panel /admin/*    │  │
│  └─────────────────────┘   └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
bizideas-backend/
├── config/db.js
├── controllers/
│   ├── authController.js       ← User signup/login (4-step flow)
│   ├── adminAuthController.js  ← Admin login + sub-admin CRUD (API)
│   ├── adminController.js      ← EJS panel handler (all sections)
│   ├── ideaController.js
│   ├── caseStudyController.js
│   ├── postController.js
│   ├── blogController.js
│   ├── miscController.js
│   ├── contactController.js
│   └── searchController.js
├── middleware/
│   ├── auth.js                 ← protect (user), protectAdmin, panelPermission, etc.
│   └── parseForm.js            ← checkbox → boolean, comma → array
├── models/
│   ├── User.js                 ← Regular users (signup flow fields)
│   ├── Admin.js                ← Admins (super + sub, with permissions[])
│   ├── BusinessIdea.js
│   ├── CaseStudy.js
│   ├── Post.js
│   ├── Blog.js
│   ├── Service.js
│   ├── Misc.js                 ← FAQ, Testimonial, Tool
│   └── Contact.js              ← Contact form + Newsletter
├── routes/
│   ├── auth.js                 ← User auth routes
│   ├── adminApi.js             ← Admin API routes (JWT)
│   ├── admin.js                ← EJS panel routes (session + permission guards)
│   ├── ideas.js
│   ├── other.js
│   └── contact.js
├── views/admin/
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── 403.ejs                 ← Permission denied page
│   ├── partials/header.ejs     ← Permission-aware sidebar (lock icons for blocked)
│   ├── partials/footer.ejs
│   ├── ideas/         (index + form)
│   ├── case-studies/  (index + form)
│   ├── blogs/         (index + form)
│   ├── services/      (index + form)
│   ├── faqs/          (index)
│   ├── testimonials/  (index)
│   ├── users/         (index + detail)
│   ├── posts/         (index)
│   ├── contacts/      (index)
│   ├── newsletter/    (index)
│   └── sub-admins/    (index + form)  ← Super Admin only
├── app.js
├── server.js
├── seed.js
└── .env
```

---

## ⚙️ Setup

```bash
npm install

# Edit .env
MONGO_URI=mongodb://localhost:27017/bizideas
JWT_USER_SECRET=your_user_secret
JWT_ADMIN_SECRET=your_admin_secret
SESSION_SECRET=your_session_secret
SUPER_ADMIN_EMAIL=superadmin@bizideas.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123

node seed.js     # Creates super admin + sample sub-admin + demo user + data
npm run dev
```

---

## 👤 USER SIGNUP — 4-Step Flow

### How it works (frontend calls these in order):

```
STEP 1 — Choose username
  GET /api/auth/check-username/:username
  Response: { available: true/false, message: "..." }

STEP 2 — Which best describes your stage?
  GET /api/auth/signup/stages
  Response: { data: ["Just exploring ideas", "Validating an idea", "Building an MVP", "Already launched", "Scaling a business"] }

STEP 3 — What is your role?
  GET /api/auth/signup/roles
  Response: { data: ["Solo founder", "Co-founder", "Developer", "Designer", "Marketer", "Investor", "Other"] }

STEP 4 — What are you interested in?
  GET /api/auth/signup/interests
  Response: { data: ["Business Ideas", "App Ideas", "Startup Ideas", "Case Studies", "Tools", "Blog & Guides"] }

FINAL — Register (all data combined)
  POST /api/auth/register
  Body:
  {
    "username": "john_doe",          ← from step 1
    "stage": "Validating an idea",   ← from step 2
    "selfRole": "Solo founder",      ← from step 3
    "interests": ["Business Ideas", "Case Studies"],  ← from step 4
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123"
  }
  Response: { success: true, token: "jwt...", user: {...} }
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, token: "jwt...", user: {...} }
```

> ⚠️ User token is signed with `JWT_USER_SECRET`. It will be **rejected** on admin routes. Admin token is signed with `JWT_ADMIN_SECRET`. It will be **rejected** on user routes.

---

## 🔐 ADMIN AUTH SYSTEM

### Two admin types:
| Type | Access | Who creates |
|------|--------|-------------|
| `super` | Everything — all sections + sub-admin management | Created via `seed.js` or manually in DB |
| `sub` | Only sections in their `permissions[]` array | Super admin creates via panel or API |

### Admin Login (EJS Panel)
```
URL: http://localhost:5000/admin/login
Credentials: email + password
Session stored server-side (8 hour expiry)
```

### Admin Login (API — for headless frontend)
```
POST /api/admin/login
Body: { email, password }
Response: { success: true, token: "admin_jwt...", admin: { adminType, permissions } }
```

---

## 🔑 SUB-ADMIN PERMISSION SYSTEM

### Available permissions (12 total):
| Permission | Controls access to |
|------------|-------------------|
| `dashboard` | Dashboard stats page |
| `ideas` | Business, App, Startup ideas |
| `case-studies` | Case studies section |
| `blogs` | Blog posts |
| `posts` | Community posts |
| `services` | Services config |
| `faqs` | FAQ management |
| `testimonials` | Testimonials |
| `users` | User management |
| `contacts` | Contact messages |
| `newsletter` | Newsletter subscribers |
| `sub-admins` | Sub-admin management (**Super only**) |

### How access control works:
1. Sub-admin logs in → session stored with their `permissions[]`
2. Every admin route has `panelPermission('section-name')` middleware
3. If sub-admin visits a page they don't have permission for → **403 EJS page rendered**
4. In sidebar → locked sections show a 🔒 icon and are **not clickable**
5. Even if URL is typed directly → middleware blocks it

### Create sub-admin via panel:
```
/admin/sub-admins → Create Sub-Admin
Fill: name, email, password
Check: which permissions to grant
```

### Create sub-admin via API:
```
POST /api/admin/sub-admins
Headers: { Authorization: "Bearer <super_admin_token>" }
Body:
{
  "name": "Content Manager",
  "email": "content@bizideas.com",
  "password": "pass123",
  "permissions": ["dashboard", "ideas", "blogs", "case-studies"]
}
```

### Update sub-admin permissions:
```
PUT /api/admin/sub-admins/:id
Headers: { Authorization: "Bearer <super_admin_token>" }
Body: { "permissions": ["dashboard", "blogs"] }
```

---

## 📡 Full API Reference

**Base URL:** `http://localhost:5000/api`

### User Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/check-username/:u` | ❌ | Username availability (Step 1) |
| GET | `/auth/signup/stages` | ❌ | Stage options (Step 2) |
| GET | `/auth/signup/roles` | ❌ | Role options (Step 3) |
| GET | `/auth/signup/interests` | ❌ | Interest options (Step 4) |
| POST | `/auth/register` | ❌ | Final registration |
| POST | `/auth/login` | ❌ | Login → get user JWT |
| GET | `/auth/me` | ✅ User | Get profile |
| PUT | `/auth/update-profile` | ✅ User | Update name/bio/stage/role/interests |
| PUT | `/auth/change-password` | ✅ User | Change password |

### Admin Auth API
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/login` | ❌ | Admin login → get admin JWT |
| GET | `/admin/me` | ✅ Admin | Get admin profile |
| GET | `/admin/permissions` | ✅ Admin | List all permissions |
| GET | `/admin/sub-admins` | ✅ Super | List sub-admins |
| POST | `/admin/sub-admins` | ✅ Super | Create sub-admin |
| PUT | `/admin/sub-admins/:id` | ✅ Super | Update permissions/status |
| DELETE | `/admin/sub-admins/:id` | ✅ Super | Delete sub-admin |

### Content APIs (public)
| Endpoint | Description |
|----------|-------------|
| `GET /ideas?type=business&page=1` | Ideas list (filterable) |
| `GET /ideas/featured` | Featured ideas (all 3 types) |
| `GET /ideas/:id` | Single idea |
| `POST /ideas/:id/upvote` | Toggle upvote [User JWT] |
| `GET /case-studies` | Case studies list |
| `GET /case-studies/featured` | Featured case studies |
| `GET /case-studies/:id` | Single case study |
| `POST /case-studies/:id/upvote` | Toggle upvote [User JWT] |
| `GET /posts` | Community posts |
| `GET /posts/recent` | Latest 8 posts (homepage) |
| `GET /posts/:id` | Single post + comments |
| `POST /posts` | Create post [User JWT] |
| `POST /posts/:id/upvote` | Upvote [User JWT] |
| `POST /posts/:id/comments` | Add comment [User JWT] |
| `GET /blogs` | Blogs list |
| `GET /blogs/featured` | Featured blogs |
| `GET /blogs/:id` | Single blog |
| `GET /homepage` | All homepage data in one call |
| `GET /services` | All services |
| `GET /faqs` | All FAQs |
| `GET /testimonials` | All testimonials |
| `GET /search?q=keyword` | Global search |
| `POST /contact` | Submit contact form |
| `POST /newsletter/subscribe` | Subscribe |
| `POST /newsletter/unsubscribe` | Unsubscribe |

---

## 🌱 Seeded Credentials

After `node seed.js`:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Super Admin | superadmin@bizideas.com | SuperAdmin@123 | Everything |
| Sub-Admin | content@bizideas.com | Content@123 | dashboard, ideas, blogs, case-studies |
| Demo User | demo@bizideas.com | Demo@123 | User API |
