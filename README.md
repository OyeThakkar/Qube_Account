# Qube Account

A comprehensive Identity and Access Management (IAM) system for Qube Cinema with integrated Ad Pod Compiler functionality.

## Features

### Core IAM Features
- **Company Management** - Manage registered companies with detailed profiles
- **Portal User Management** - Centralized management of internal users
- **Services Management** - View and manage Qube Cinema services
- **Dashboard** - Overview of system metrics and recent activities

### Ad Pod Compiler
A deterministic, upstream-controlled system for creating weekly ad pods for theatres. Key features include:
- **CPL Stitching** - Combine multiple CPLs into a single unified composition
- **Validation Layer** - Ensure compatibility across CPLs
- **DCP Package Generation** - Generate complete DCP packages with ASSETMAP, PKL, and CPL
- **Deterministic Pod IDs** - Idempotent pod creation with guaranteed naming
- **Multi-Step Wizard** - Intuitive UI for configuring and creating ad pods

For detailed documentation on the Ad Pod Compiler, see [docs/ad-pod-compiler.md](docs/ad-pod-compiler.md).

## Tech Stack

- **Framework**: Next.js 15.2.3 with TypeScript
- **UI Components**: Radix UI with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **AI Integration**: Genkit with Google AI

## Getting Started

### Prerequisites
- Node.js 20 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── ad-pods/           # Ad Pod Compiler feature
│   ├── companies/         # Company management
│   ├── portal-users/      # Portal user management
│   ├── services/          # Services management
│   └── settings/          # System settings
├── components/            # React components
│   ├── ad-pods/          # Ad Pod Compiler components
│   ├── company/          # Company-related components
│   ├── layout/           # Layout components
│   ├── shared/           # Shared components
│   └── ui/               # UI primitives
├── lib/                  # Utility functions
│   ├── ad-pod-utils.ts  # Ad Pod Compiler utilities
│   ├── mock-data.ts     # Mock data for development
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
```

## Features Overview

### Ad Pod Compiler
Navigate to `/ad-pods` to access the Ad Pod Compiler. This feature allows you to:
1. Configure theatre and content parameters
2. Upload CPL files in the desired playback order
3. Validate CPL compatibility
4. Generate unified DCP packages
5. Download complete package information

### Company Management
- Add, edit, and view company profiles
- Manage subscribed services
- Track company users
- Monitor company status

### Portal Users
- Manage internal Qube Cinema users
- Assign roles (Admin, Company Manager, Viewer)
- Track user activities

### Services
- View all Qube Cinema services
- Monitor subscribed companies per service
- Access service configuration

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - Qube Cinema Inc.
