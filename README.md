# My Job Track Admin

A comprehensive admin interface for managing the My Job Track application data.

## Features

- **Dashboard**: Overview of key metrics, recent jobs, and customers
- **Customer Management**: View, create, edit, and delete customers
- **Job Management**: Manage jobs with status tracking and payment information
- **Analytics**: Business insights with charts and performance metrics
- **Settings**: Configure business information, notifications, and system preferences

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **TanStack Table** for advanced table functionality
- **Recharts** for analytics charts
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Heroicons** for icons
- **@ Path Aliases** for clean, maintainable imports

## 🔧 Path Aliases

This project uses comprehensive path aliases for clean imports:

```typescript
// Instead of: import { Component } from '../../../components/UI/Component'
import { Component } from '@/components/UI/Component'

// Available aliases:
import from '@/components/*'    // UI components
import from '@/pages/*'         // Page components  
import from '@/lib/*'          // Utilities and API
import from '@/hooks/*'        // Custom React hooks
import from '@/types'          // TypeScript types
import from '@/contexts/*'     // React contexts
```

## Data Architecture

- **Backend**: Cloudflare Workers API
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Admin Interface**: React SPA connecting to the Worker API
- **Deployment**: Static hosting + Cloudflare infrastructure

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the admin directory:
   ```bash
   cd my-job-track-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The admin interface will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## Deployment

### Cloudflare Pages (Recommended)

1. **Connect your repository** to Cloudflare Pages
2. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `18`

3. **Set environment variables**:
   - `VITE_API_BASE_URL`: Your Cloudflare Worker URL
   - `NODE_VERSION`: `18`

4. **Update redirects**: Modify `_redirects` file with your Worker URL

### Other Static Hosting

The built application in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Sidebar, Header)
│   └── UI/            # Basic UI components (Button, Input, etc.)
├── pages/             # Page components
├── lib/               # Utilities and API client
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component
```

## API Integration

The admin interface connects to the main Job Track API running on port 8787, which uses **Cloudflare D1** as the database backend. The data flow is:

```
Admin Interface → Job Track API (Cloudflare Worker) → Cloudflare D1 Database
```

**Prerequisites:**
- Main Job Track application running on port 8787
- Cloudflare D1 database properly configured
- Valid Cloudflare Worker deployment with D1 bindings

Make sure the main application is running and connected to your Cloudflare D1 database before using the admin interface.

## Key Components

### Dashboard
- Real-time stats overview
- Recent jobs and customers
- Quick action buttons

### Data Tables
- Sortable columns
- Pagination
- Search and filtering
- Responsive design

### Forms
- Form validation
- Error handling
- Toast notifications

### Analytics
- Revenue tracking
- Job status distribution
- Customer growth charts
- Key performance metrics

## Configuration

The application can be configured through the Settings page:

- Business information
- Notification preferences
- System settings
- Data management actions

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Add navigation item to `src/components/Layout/Layout.tsx`

### Adding New API Endpoints

1. Add the endpoint method to `src/lib/api.ts`
2. Create appropriate TypeScript types in `src/types/`
3. Use with TanStack Query in your components

### Styling

The project uses TailwindCSS with a custom design system. Key classes are defined in `src/index.css`.

## Contributing

1. Follow TypeScript best practices
2. Use semantic commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## Troubleshooting

### Common Issues

**"Unable to connect to the server"**
- Ensure your Cloudflare Worker is deployed and running
- Check that the API URL in `.env` is correct
- Verify D1 database binding in your Worker

**"Service temporarily unavailable"**
- Cloudflare Worker may be over quota or experiencing issues
- Check Cloudflare dashboard for Worker status
- Wait a few minutes and try again

**Data not loading**
- Verify D1 database has been seeded with data
- Check Worker logs in Cloudflare dashboard
- Ensure CORS is properly configured in your Worker

**Development server connection issues**
- Make sure main Job Track app is running on port 8787
- Check if proxy configuration in `vite.config.ts` is correct
- Verify no firewall is blocking local connections

## License

This project is part of the My Job Track application suite.
