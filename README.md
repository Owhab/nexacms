# NexaCMS

Modern Content Management System with Shopify-like page builder interface.

## Features

- **Drag & Drop Page Builder** - Visual page editor with real-time preview
- **Role-Based Access Control** - Admin, Editor, and Viewer roles
- **Authentication System** - Secure JWT-based authentication
- **Media Management** - Upload and manage images and files
- **SEO Optimization** - Built-in SEO settings for pages
- **Responsive Design** - Mobile-first responsive interface
- **Modern Tech Stack** - Next.js, React, TypeScript, Prisma, PostgreSQL

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexacms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the database connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/nexacms"
   JWT_SECRET="your-secure-random-string"
   ```

4. **Set up the database**
   ```bash
   # Create and apply database migrations
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Landing page: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Demo storefront: http://localhost:3000/storefront

### Database Setup Options

#### Option 1: Local PostgreSQL
Install PostgreSQL locally and create a database:
```sql
CREATE DATABASE nexacms;
CREATE USER nexacms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nexacms TO nexacms_user;
```

#### Option 2: Docker PostgreSQL
```bash
docker run --name nexacms-postgres -e POSTGRES_DB=nexacms -e POSTGRES_USER=nexacms_user -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15
```

#### Option 3: Cloud Database
Use services like:
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- AWS RDS, Google Cloud SQL, etc.

## User Roles

### Admin
- Full access to all features
- User management
- Settings configuration
- Content publishing
- Media management

### Editor
- Create and edit pages
- Upload and manage media
- Save drafts (cannot publish)
- View all content

### Viewer
- Read-only access to admin dashboard
- View pages and media
- Cannot make changes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
nexacms/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   └── storefront/        # Public-facing pages
├── components/            # Reusable React components
├── contexts/              # React contexts (auth, etc.)
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.