## About Quick Order:
This is an undergoing project meant for managing restaurant as well as customer orders.

## Key Features:
- [x] Username - password authentication (Implemented)
- [ ] Google OAuth (Coming soon)
- [x] User roles (only Admin is available)
- [x] Employee CRUD management (Implemented)
- [x] Dishes CRUD management (Implemented in dev)
- [ ] QR code food ordering system (Undergoing)
- [ ] i18n (Coming soon)
- [ ] SEO (Coming soon)
      
## Tech Stack:

### Front-end:
- Next.js
- TailwindCSS
- ShadCN
- Tanstack Query/Table
- Vercel

### Back-end:
- Fastify (Node.js)
- SQLite3
- Prisma ORM
- JWT
- AWS S3
- AWS EC2

### CI/CD:
- GitHub Actions

### Containerization:
- Docker

## Available Routes:

- `/login`
  - **Admin credentials:**
    - Username: `admin@order.com`
    - Password: `123456`
  
- `/manage/dishes`
- `/manage/accounts`
- `/manage/setting`
