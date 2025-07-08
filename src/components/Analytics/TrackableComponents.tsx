import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, FormHTMLAttributes } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { TrackingProperties } from '../../types';

// Trackable Button Component
interface TrackableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  trackingEvent?: string;
  trackingProperties?: TrackingProperties;
  feature?: string;
  action?: string;
}

export const TrackableButton: React.FC<TrackableButtonProps> = ({
  children,
  onClick,
  trackingEvent,
  trackingProperties,
  feature,
  action,
  ...props
}) => {
  const { trackEvent, trackFeatureInteraction } = useAnalytics();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the event
    if (trackingEvent) {
      trackEvent(trackingEvent, trackingProperties);
    }

    if (feature && action) {
      trackFeatureInteraction(feature, action, trackingProperties);
    }

    // Call the original onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

// Trackable Link Component
interface TrackableLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  trackingEvent?: string;
  trackingProperties?: TrackingProperties;
}

export const TrackableLink: React.FC<TrackableLinkProps> = ({
  children,
  onClick,
  trackingEvent,
  trackingProperties,
  ...props
}) => {
  const { trackEvent } = useAnalytics();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Track the event
    if (trackingEvent) {
      trackEvent(trackingEvent, trackingProperties);
    }

    // Call the original onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

// Trackable Form Component
interface TrackableFormProps extends FormHTMLAttributes<HTMLFormElement> {
  trackingEvent?: string;
  trackingProperties?: TrackingProperties;
  feature?: string;
}

export const TrackableForm: React.FC<TrackableFormProps> = ({
  children,
  onSubmit,
  trackingEvent,
  trackingProperties,
  feature,
  ...props
}) => {
  const { trackEvent, trackFeatureInteraction } = useAnalytics();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Track the event
    if (trackingEvent) {
      trackEvent(trackingEvent, trackingProperties);
    }

    if (feature) {
      trackFeatureInteraction(feature, 'form_submit', trackingProperties);
    }

    // Call the original onSubmit handler
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

// Hook for custom click tracking
export const useTrackClick = () => {
  const { trackEvent, trackFeatureInteraction } = useAnalytics();

  const trackClick = (
    eventName: string,
    properties?: TrackingProperties,
    feature?: string,
    action?: string
  ) => {
    trackEvent(eventName, properties);
    
    if (feature && action) {
      trackFeatureInteraction(feature, action, properties);
    }
  };

  return { trackClick, trackEvent, trackFeatureInteraction };
};

// Higher-order component for adding tracking to any component
export const withTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultTrackingEvent?: string,
  defaultProperties?: TrackingProperties
) => {
  return React.forwardRef<any, P & {
    trackingEvent?: string;
    trackingProperties?: TrackingProperties;
  }>((props, ref) => {
    const { trackEvent } = useAnalytics();
    const { trackingEvent, trackingProperties, ...restProps } = props;

    React.useEffect(() => {
      const eventToTrack = trackingEvent || defaultTrackingEvent;
      if (eventToTrack) {
        trackEvent(eventToTrack, { ...defaultProperties, ...trackingProperties });
      }
    }, [trackingEvent, trackingProperties, trackEvent]);

    return <WrappedComponent ref={ref} {...(restProps as P)} />;
  });
};
