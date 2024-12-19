###### This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# E-commerce Admin Dashboard

A modern, full-stack e-commerce admin dashboard built with Next.js 15, React, Tailwind CSS, and Prisma. This application allows store owners to manage their online stores efficiently with features for product management, inventory tracking, and sales analytics.

Note that it has a front end store ready to connect , which was part 2 , and it's in [this repository](https://github.com/BasemAmr/E-Commerce-Clothes-and-accessories-Store-Front-end)

## Features

- 📊 Real-time dashboard analytics
- 📦 Product management (CRUD operations)
- 🏷️ Category and size management
- 💰 Revenue tracking and reporting
- 📈 Sales analytics with visual charts
- 🔐 Secure authentication with Clerk
- 🎨 Modern UI with Tailwind CSS and Shadcn UI 
- 📱 Fully responsive design

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Neon](https://www.neon.tech/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Image Upload** [ImageKit](https://imagekit.io/)
- **Payment Gateway**: [Paymob](https://paymob.com/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database 

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BasemAmr/CMS---E-Commerce-Admin-Dashboard
cd e-commerce-admin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

Create a `.env` file in the root directory and add your environment variables:
```env

DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Imagekit
NEXT_PUBLIC_PUBLIC_KEY=
NEXT_PUBLIC_URL_ENDPOINT=
PRIVATE_KEY=

#Paymob Payment Gateway
PAYMOB_API_KEY=
PAYMOB_SECRET_KEY=
PAYMOB_PUBLIC_KEY=

# Needed with Payment Integration and Webhooks only
FRONTEND_STORE_URL=
NEXT_PUBLIC_BACKEND_STORE_URL=
```

3. Set up the database with Prisma:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open http://localhost:3000 with your browser to see the application.

## Project Structure
```
├── app/
│   ├── (auth)/         # Authentication related pages
│   ├── (dashboard)/    # Dashboard, store management, and main layout
│   ├── (root)/         # Check for created stores and show create store modal
│   ├── api/           # API routes
│   └── layout.tsx     # Setup Providers
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/             # Utility functions and configurations
├── providers/             # Modal (Dialog Box) Provdier 
└── prisma/          # Database schema and migrations
```

## Features in Detail
### Dashboard Overview
- Total revenue calculation
- Order tracking
- Product stock monitoring
- Daily revenue charts
  
### Product Management
- Create, update, and delete products
- Image upload and management
- Inventory tracking
- Category and size assignment

### Order Management
- View and manage orders
- Order status updates
- Payment tracking


Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is licensed under the MIT License

Support
For support, email [basemsleem652@gmail.com] or open an issue in the repository.

Acknowledgments
Thanks to [Code With Antonio](https://www.youtube.com/watch?v=5miHyP6lExg) for the project guidance! ❤
shadcn/ui for the beautiful UI components
Vercel for hosting

