import { useState } from 'react';
import { 
  BasicAnalyticsExample, 
  ConversionTrendChart, 
  RealTimeDashboard,
  GeographicAnalytics, 
  FeatureUsageTracker,
  EventAnalytics
} from '@/components/Analytics/CustomAnalyticsExamples';

type ExampleTab = 'basic' | 'charts' | 'realtime' | 'geographic' | 'features' | 'events';

export function Examples() {
  const [activeTab, setActiveTab] = useState<ExampleTab>('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Analytics', icon: '📊' },
    { id: 'charts', label: 'Custom Charts', icon: '📈' },
    { id: 'realtime', label: 'Real-time Dashboard', icon: '🔄' },
    { id: 'geographic', label: 'Geographic Analytics', icon: '🌍' },
    { id: 'features', label: 'Feature Usage', icon: '⚡' },
    { id: 'events', label: 'Event Analytics', icon: '🎯' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">📖 Basic Analytics Example</h3>
              <p className="text-blue-800">
                Demonstrates simple analytics fetching with React Query, error handling, 
                and displaying key metrics in stat cards. Perfect starting point for analytics components.
              </p>
              <div className="mt-2 text-sm text-blue-600">
                <strong>Features:</strong> Data fetching, loading states, stat cards, formatting
              </div>
            </div>
            <BasicAnalyticsExample />
          </div>
        );
      
      case 'charts':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">📈 Custom Chart Components</h3>
              <p className="text-green-800">
                Shows how to create custom charts using Recharts library with data transformation 
                and responsive design. Great for building custom visualizations.
              </p>
              <div className="mt-2 text-sm text-green-600">
                <strong>Features:</strong> Bar charts, data transformation, responsive containers
              </div>
            </div>
            <ConversionTrendChart />
          </div>
        );
      
      case 'realtime':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">🔄 Real-time Dashboard</h3>
              <p className="text-purple-800">
                Advanced example with real-time updates, interactive filters, and live metrics. 
                Shows how to build production-ready dashboards with auto-refresh capabilities.
              </p>
              <div className="mt-2 text-sm text-purple-600">
                <strong>Features:</strong> Auto-refresh, filters, real-time metrics, interactive controls
              </div>
            </div>
            <RealTimeDashboard />
          </div>
        );
      
      case 'geographic':
        return (
          <div className="space-y-6">
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-900 mb-2">🌍 Geographic Analytics</h3>
              <p className="text-cyan-800">
                Displays geographic data with pie charts and interactive country lists. 
                Perfect for showing user distribution and regional analytics.
              </p>
              <div className="mt-2 text-sm text-cyan-600">
                <strong>Features:</strong> Pie charts, geographic data, color coordination, lists
              </div>
            </div>
            <GeographicAnalytics />
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">⚡ Feature Usage Tracking</h3>
              <p className="text-orange-800">
                Advanced component for tracking feature adoption and usage patterns. 
                Includes interactive feature selection and trend visualization.
              </p>
              <div className="mt-2 text-sm text-orange-600">
                <strong>Features:</strong> Interactive selection, area charts, feature comparison, trends
              </div>
            </div>
            <FeatureUsageTracker />
          </div>
        );
      
      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-2">🎯 Event Analytics</h3>
              <p className="text-red-800">
                Comprehensive event tracking with multiple chart types and data tables. 
                Shows events by category, trends over time, and detailed event metrics.
              </p>
              <div className="mt-2 text-sm text-red-600">
                <strong>Features:</strong> Multiple chart types, data tables, event categorization, trends
              </div>
            </div>
            <EventAnalytics />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Examples Gallery</h1>
          <p className="mt-2 text-lg text-gray-600">
            Interactive examples showcasing different analytics components and patterns
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExampleTab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 How to Use These Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">📋 Copy Components</h4>
              <p>Copy any of these components into your own pages for quick analytics integration.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">🔧 Customize</h4>
              <p>Modify the queries, styling, and data transformations to fit your specific needs.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">📊 Mix & Match</h4>
              <p>Combine different chart types and layouts to create custom dashboard views.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">🚀 Production Ready</h4>
              <p>All examples include proper error handling, loading states, and responsive design.</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Check the browser dev tools Network tab to see the analytics API calls in action!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
