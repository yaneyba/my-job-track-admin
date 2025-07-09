import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AnalyticsContextType } from '@/types';

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID from sessionStorage
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Determine user type based on various factors
const getUserType = (): 'demo' | 'waitlisted' | 'authenticated' | 'anonymous' => {
  // Check localStorage for user state
  const isWaitlisted = localStorage.getItem('waitlist_email');
  const isAuthenticated = localStorage.getItem('auth_token');
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  if (isAuthenticated) return 'authenticated';
  if (isWaitlisted) return 'waitlisted';
  if (isDemoMode) return 'demo';
  return 'anonymous';
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [sessionId] = useState(getSessionId);
  const [userType, setUserType] = useState<'demo' | 'waitlisted' | 'authenticated' | 'anonymous'>(getUserType);
  const [demoMode, setDemoMode] = useState<boolean>(localStorage.getItem('demo_mode') === 'true');
  const [sessionStartTime] = useState(Date.now());
  const [eventQueue, setEventQueue] = useState<any[]>([]);

  // Update user type when localStorage changes
  useEffect(() => {
    const updateUserType = () => {
      setUserType(getUserType());
      setDemoMode(localStorage.getItem('demo_mode') === 'true');
    };

    window.addEventListener('storage', updateUserType);
    return () => window.removeEventListener('storage', updateUserType);
  }, []);

  // Send queued events to API
  const sendEvents = useCallback(async (events: any[]) => {
    if (events.length === 0) return;

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        console.warn('Failed to send analytics events:', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }, []);

  // Flush events periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (eventQueue.length > 0) {
        sendEvents([...eventQueue]);
        setEventQueue([]);
      }
    }, 5000); // Send events every 5 seconds

    return () => clearInterval(interval);
  }, [eventQueue, sendEvents]);

  // Send remaining events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (eventQueue.length > 0) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({ events: eventQueue }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [eventQueue]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    const event = {
      sessionId,
      eventName,
      timestamp: new Date().toISOString(),
      demoMode,
      userType,
      page: window.location.pathname,
      properties: properties || {},
    };

    // Log in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event);
    }

    setEventQueue(prev => [...prev, event]);
  }, [sessionId, demoMode, userType]);

  const trackPageView = useCallback((page: string, referrer?: string) => {
    const event = {
      sessionId,
      eventName: 'page_view',
      timestamp: new Date().toISOString(),
      demoMode,
      userType,
      page,
      properties: {
        referrer: referrer || document.referrer,
        userAgent: navigator.userAgent,
      },
    };

    setEventQueue(prev => [...prev, event]);
  }, [sessionId, demoMode, userType]);

  const trackFeatureInteraction = useCallback((
    feature: string, 
    action: string, 
    properties?: Record<string, any>
  ) => {
    const event = {
      sessionId,
      eventName: 'feature_interaction',
      timestamp: new Date().toISOString(),
      demoMode,
      userType,
      page: window.location.pathname,
      properties: {
        feature,
        action,
        demo_mode: demoMode,
        ...properties,
      },
    };

    setEventQueue(prev => [...prev, event]);
  }, [sessionId, demoMode, userType]);

  const trackConversion = useCallback((source: string, email?: string) => {
    const event = {
      sessionId,
      eventName: 'waitlist_signup_completed',
      timestamp: new Date().toISOString(),
      demoMode,
      userType,
      page: window.location.pathname,
      properties: {
        source,
        emailDomain: email ? email.split('@')[1] : undefined,
        sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000),
      },
    };

    setEventQueue(prev => [...prev, event]);

    // Update user type to waitlisted
    setUserType('waitlisted');
    localStorage.setItem('waitlist_email', email || 'true');
  }, [sessionId, demoMode, userType, sessionStartTime]);

  const trackWaitlistCTA = useCallback((source: string, properties?: Record<string, any>) => {
    const event = {
      sessionId,
      eventName: 'waitlist_cta_triggered',
      timestamp: new Date().toISOString(),
      demoMode,
      userType,
      page: window.location.pathname,
      properties: {
        source,
        sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000),
        ...properties,
      },
    };

    setEventQueue(prev => [...prev, event]);
  }, [sessionId, demoMode, userType, sessionStartTime]);

  const initSession = useCallback(async (landingPage: string, referrer?: string) => {
    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          demoMode,
          userType,
          landingPage,
          referrer: referrer || document.referrer,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn('Failed to initialize analytics session:', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics session initialization error:', error);
    }
  }, [sessionId, demoMode, userType]);

  // Initialize session on mount
  useEffect(() => {
    initSession(window.location.pathname);
  }, [initSession]);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  const contextValue: AnalyticsContextType = {
    sessionId,
    userType,
    demoMode,
    trackEvent,
    trackPageView,
    trackFeatureInteraction,
    trackConversion,
    trackWaitlistCTA,
    initSession,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
