# Cloudflare D1 Integration Guide

This guide helps you connect the My Job Track Admin interface to your Cloudflare D1 database.

## Prerequisites

- Cloudflare account with Workers and D1 enabled
- Main Job Track application deployed as a Cloudflare Worker
- D1 database created and bound to your Worker

## Setup Steps

### 1. Verify Your Worker API

Ensure your main Job Track Worker is running and accessible:

```bash
curl https://your-worker.your-subdomain.workers.dev/api/dashboard/stats
```

### 2. Configure Admin Environment

Update `.env` with your Worker URL:

```env
VITE_API_BASE_URL=https://your-worker.your-subdomain.workers.dev
```

### 3. Test Local Development

```bash
npm run dev
```

The admin should connect to your live Cloudflare Worker and D1 database.

### 4. Deploy to Cloudflare Pages

1. **Push to GitHub/GitLab** (if not already done)
2. **Connect to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your repository
3. **Configure build**:
   - Build command: `npm run build`
   - Build output: `dist`
   - Environment variables: Set `VITE_API_BASE_URL`
4. **Deploy**

## API Endpoints Expected

Your Cloudflare Worker should provide these endpoints:

```
GET  /api/dashboard/stats     # Dashboard statistics
GET  /api/customers          # List customers
POST /api/customers          # Create customer
GET  /api/customers/:id      # Get customer
PUT  /api/customers/:id      # Update customer
DELETE /api/customers/:id    # Delete customer

GET  /api/jobs               # List jobs
POST /api/jobs               # Create job
GET  /api/jobs/:id           # Get job
PUT  /api/jobs/:id           # Update job
DELETE /api/jobs/:id         # Delete job

GET  /api/users              # List users (optional)
```

## D1 Database Schema

Ensure your D1 database has these tables:

```sql
-- Customers table
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    businessName TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Jobs table
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    priority TEXT NOT NULL DEFAULT 'medium',
    scheduledDate TEXT,
    completedDate TEXT,
    estimatedHours REAL,
    actualHours REAL,
    hourlyRate REAL,
    totalAmount REAL,
    paymentStatus TEXT NOT NULL DEFAULT 'unpaid',
    location TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);
```

## CORS Configuration

Your Worker must handle CORS for the admin interface:

```javascript
// In your Worker
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Or your admin domain
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS requests
if (request.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}

// Add to all responses
return new Response(data, {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

## Troubleshooting

### Connection Issues
- Check Worker deployment status in Cloudflare dashboard
- Verify D1 binding name matches your Worker code
- Test API endpoints directly with curl/Postman

### Data Issues
- Check if D1 database has been seeded
- Verify table structure matches expected schema
- Look at Worker logs for SQL errors

### Performance
- D1 queries should be optimized with proper indexes
- Consider implementing caching for frequently accessed data
- Monitor Worker CPU and memory usage

## Monitoring

- **Cloudflare Analytics**: Monitor Worker requests and performance
- **D1 Analytics**: Track database queries and performance
- **Admin Interface**: Built-in error handling and user feedback

For more details, see the main [README.md](./README.md) file.
