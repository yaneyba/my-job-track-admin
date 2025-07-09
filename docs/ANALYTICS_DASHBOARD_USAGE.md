# Analytics Dashboard Usage Guide

This guide provides step-by-step instructions for using the Analytics data in the My Job Track Admin Dashboard.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Analytics Overview](#analytics-overview)
3. [Session Analytics](#session-analytics)
4. [Event Tracking](#event-tracking)
5. [Feature Usage Analytics](#feature-usage-analytics)
6. [Funnel Analysis](#funnel-analysis)
7. [A/B Testing Results](#ab-testing-results)
8. [Filtering and Date Ranges](#filtering-and-date-ranges)
9. [Custom Analytics Components](#custom-analytics-components)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Step 1: Access the Analytics Dashboard
1. Start the admin development server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173` in your browser
3. Log in with demo credentials:
   - Email: `admin@demo.com`
   - Password: `demo123`
4. Click on "Analytics" in the navigation menu

### Step 2: Understanding the Analytics Layout
The Analytics page is organized into several sections:
- **Overview Metrics**: Key performance indicators at the top
- **Session Analytics**: User session data and patterns
- **Event Analytics**: User interaction tracking
- **Feature Usage**: How users interact with specific features
- **Funnel Analysis**: User journey and conversion tracking
- **A/B Testing**: Experiment results and comparisons

## Analytics Overview

### Key Metrics Display
The overview section shows:

1. **Total Sessions**: Number of unique user sessions
2. **Total Events**: Number of tracked user interactions
3. **Average Session Duration**: How long users stay on the site
4. **Conversion Rate**: Percentage of users who complete desired actions
5. **Demo Mode Usage**: Percentage of sessions using demo features

### Top Pages Analysis
- **Landing Pages**: Most common entry points to your site
- **Exit Pages**: Where users most commonly leave
- **Page Performance**: Views and engagement percentages

### User Type Breakdown
View analytics segmented by user types:
- New visitors vs returning users
- Demo users vs authenticated users
- Different user categories and their conversion rates

## Session Analytics

### Daily Session Trends
1. **View the Chart**: The line chart shows daily session counts over the last 30 days
2. **Identify Patterns**: Look for:
   - Weekly patterns (weekday vs weekend usage)
   - Growth trends or decline
   - Unusual spikes or drops

### Session Duration Analysis
1. **Duration Buckets**: Sessions are grouped into time ranges:
   - 0-30 seconds (likely bounces)
   - 30s-1 minute (quick visits)
   - 1-5 minutes (engaged browsing)
   - 5-15 minutes (deep engagement)
   - 15-30 minutes (power users)
   - 30+ minutes (very engaged users)

2. **Bounce Rate**: Percentage of single-page sessions
   - High bounce rate (>70%) may indicate:
     - Poor landing page experience
     - Irrelevant traffic
     - Technical issues

### Geographic and Device Data
1. **Geographic Analysis**:
   - View top countries by session count
   - Identify your main user base locations
   - Plan localization efforts

2. **Device Breakdown**:
   - Mobile vs Desktop vs Tablet usage
   - Optimize for your primary device types

## Event Tracking

### Understanding Event Data
Events track specific user interactions:

1. **Top Events**: Most frequently triggered events
2. **Event Categories**: Grouped by functionality (navigation, forms, features)
3. **Conversion Events**: Events that lead to conversions
4. **Daily Event Trends**: Event frequency over time

### Key Event Types to Monitor
- **Page Views**: Navigation patterns
- **Button Clicks**: Feature engagement
- **Form Submissions**: User actions
- **Error Events**: Technical issues
- **Search Events**: User intent

### Using Event Data for Optimization
1. **High-Volume Events**: Focus optimization efforts here
2. **Low-Conversion Events**: Identify improvement opportunities
3. **Error Events**: Fix technical issues immediately

## Feature Usage Analytics

### Feature Adoption Tracking
1. **Top Features**: Most used features ranked by usage
2. **Adoption Rate**: Percentage of users trying each feature
3. **Unique Users**: How many distinct users use each feature

### Feature Trends
1. **Weekly Usage Patterns**: Track feature adoption over time
2. **Trend Indicators**:
   - ↗️ **Up**: Growing usage (>10% increase)
   - ↘️ **Down**: Declining usage (>10% decrease)  
   - ➡️ **Stable**: Consistent usage

### Demo Mode vs Production
Compare feature usage between:
- Demo users (trying features)
- Authenticated users (actual usage)

This helps identify:
- Features that convert demo users
- Features with high demo engagement but low production adoption

## Funnel Analysis

### Understanding Conversion Funnels
Funnels track user journey through key steps:

1. **Funnel Steps**: Sequential user actions
2. **Conversion Rates**: Percentage completing each step
3. **Drop-off Points**: Where users leave the funnel

### Key Funnel Metrics
- **Overall Conversion Rate**: End-to-end success rate
- **Step-by-Step Conversion**: Individual step performance
- **Drop-off Analysis**: Biggest loss points
- **Average Time to Convert**: How long the journey takes

### Optimizing Funnels
1. **Identify Bottlenecks**: Steps with high drop-off rates
2. **A/B Testing**: Test improvements on problematic steps
3. **User Experience**: Simplify complex steps
4. **Technical Issues**: Fix broken funnel steps

## A/B Testing Results

### Reading A/B Test Data
1. **Test Name**: Experiment identifier
2. **Variants**: Different versions tested (Control vs Treatment)
3. **Users**: Number of users in each variant
4. **Conversions**: Successful outcomes per variant
5. **Conversion Rate**: Success percentage per variant
6. **Winner**: Best performing variant
7. **Significance**: Statistical confidence level

### Making Data-Driven Decisions
1. **Statistical Significance**: Only act on results with >95% confidence
2. **Sample Size**: Ensure adequate user count for reliable results
3. **Test Duration**: Run tests for full business cycles
4. **Implementation**: Roll out winning variants to all users

## Filtering and Date Ranges

### Available Filters
1. **Date Range**: 
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Custom date range

2. **User Type**:
   - New visitors
   - Returning visitors
   - Demo users
   - Authenticated users

3. **Geographic**:
   - Filter by country
   - Multiple country selection

4. **Demo Mode**:
   - Demo sessions only
   - Production sessions only
   - All sessions

### Applying Filters
1. **Single Filter**: Select one filter option
2. **Multiple Filters**: Combine filters for detailed analysis
3. **Filter Reset**: Clear all filters to see complete data
4. **Filter Persistence**: Filters apply across all analytics sections

## Custom Analytics Components

### Using Pre-built Components
The dashboard includes reusable analytics components:

```typescript
// Example: Custom metric display
import { MetricCard } from '@/components/Analytics/MetricCard';

<MetricCard
  title="Custom Conversion Rate"
  value={`${conversionRate.toFixed(1)}%`}
  trend="up"
  description="7-day moving average"
/>
```

### Creating Custom Analytics Views
1. **Access Raw Data**: Use the analytics API directly
2. **Custom Charts**: Implement with Chart.js or D3
3. **Custom Filters**: Add specific business logic
4. **Real-time Updates**: Subscribe to data changes

Example custom component:
```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export function CustomAnalyticsView() {
  const { data, loading, error } = useAnalytics({
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    userType: ['authenticated']
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>Custom Analytics View</h2>
      {/* Your custom visualization */}
    </div>
  );
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. No Data Showing
**Problem**: Analytics dashboard shows empty charts or zero values

**Solutions**:
- Check if the API is running and accessible
- Verify database connection and data existence
- Check browser console for error messages
- Ensure proper authentication tokens

#### 2. Slow Loading
**Problem**: Analytics data takes too long to load

**Solutions**:
- Use smaller date ranges for testing
- Check database performance and indexing
- Optimize SQL queries in analytics service
- Implement caching for frequently accessed data

#### 3. Incorrect Data
**Problem**: Analytics show unexpected values

**Solutions**:
- Verify date range filters are correct
- Check for timezone issues in data
- Validate SQL queries in analytics service
- Compare with raw database data

#### 4. Charts Not Rendering
**Problem**: Charts appear broken or empty

**Solutions**:
- Check Chart.js library is properly imported
- Verify chart data format matches expected structure
- Check browser compatibility
- Review console for JavaScript errors

### Debug Mode
Enable debug logging by adding to your environment:
```bash
VITE_DEBUG_ANALYTICS=true
```

This will log analytics API calls and responses to the browser console.

### API Testing
Test analytics endpoints directly:
```bash
# Test overview endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/analytics/overview"

# Test with filters
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/analytics/overview?dateRange=7d&userType=authenticated"
```

## Best Practices

### 1. Regular Monitoring
- Check analytics daily for key metrics
- Set up alerts for unusual patterns
- Review weekly trends and patterns
- Monthly deep-dive analysis

### 2. Data-Driven Decisions
- Always validate assumptions with data
- Use statistical significance for A/B tests
- Consider multiple metrics, not just conversion
- Account for external factors (seasonality, marketing campaigns)

### 3. Performance Optimization
- Use appropriate date ranges for analysis
- Cache frequently accessed data
- Implement pagination for large datasets
- Optimize database queries

### 4. Privacy and Compliance
- Respect user privacy preferences
- Implement data retention policies
- Ensure GDPR/CCPA compliance
- Anonymize sensitive user data

## Advanced Usage

### Custom Analytics Queries
For advanced users, you can create custom analytics queries:

```typescript
// Example: Custom retention analysis
const retentionQuery = `
  SELECT 
    DATE(first_session.started_at) as cohort_date,
    COUNT(DISTINCT first_session.session_id) as cohort_size,
    COUNT(DISTINCT return_session.session_id) as returned_users,
    ROUND(
      COUNT(DISTINCT return_session.session_id) * 100.0 / 
      COUNT(DISTINCT first_session.session_id), 2
    ) as retention_rate
  FROM (
    SELECT session_id, MIN(started_at) as started_at
    FROM trk_sessions 
    GROUP BY session_id
  ) first_session
  LEFT JOIN trk_sessions return_session 
    ON first_session.session_id = return_session.session_id
    AND return_session.started_at > first_session.started_at + INTERVAL 7 DAY
  GROUP BY DATE(first_session.started_at)
  ORDER BY cohort_date DESC
`;
```

### Integration with External Tools
- Export data to Google Analytics
- Send metrics to Slack notifications
- Create automated reports
- Integrate with business intelligence tools

## Support and Resources

### Documentation
- [API Reference](./API_REFERENCE.md)
- [Database Schema](../database/schema.sql)
- [Component Library](./COMPONENT_REFERENCE.md)

### Getting Help
- Check the troubleshooting section first
- Review error logs and console messages
- Test API endpoints independently
- Verify database connectivity and data

For additional support, refer to the main project documentation or create an issue in the project repository.
