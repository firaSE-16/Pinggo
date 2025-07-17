'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  onLoadComplete?: (loadTime: number) => void;
}

export const PerformanceMonitor = ({ 
  componentName, 
  onLoadComplete 
}: PerformanceMonitorProps) => {
  const startTime = useRef<number>(Date.now());
  const hasReported = useRef<boolean>(false);

  useEffect(() => {
    const handleLoadComplete = () => {
      if (hasReported.current) return;
      
      const loadTime = Date.now() - startTime.current;
      hasReported.current = true;
      
      // Log performance data
      console.log(`🚀 ${componentName} loaded in ${loadTime}ms`);
      
      // Report to analytics or monitoring service
      if (onLoadComplete) {
        onLoadComplete(loadTime);
      }
      
      // Send to performance monitoring service (if available)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'component_load', {
          component_name: componentName,
          load_time: loadTime,
        });
      }
    };

    // Report after a short delay to ensure component is fully rendered
    const timer = setTimeout(handleLoadComplete, 100);

    return () => {
      clearTimeout(timer);
      handleLoadComplete();
    };
  }, [componentName, onLoadComplete]);

  return null;
};

// Global performance tracking
export const trackPageLoad = (pageName: string) => {
  if (typeof window !== 'undefined') {
    const loadTime = performance.now();
    console.log(`📊 Page ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Store in localStorage for analytics
    const pageLoads = JSON.parse(localStorage.getItem('pageLoads') || '{}');
    pageLoads[pageName] = {
      loadTime,
      timestamp: Date.now(),
      count: (pageLoads[pageName]?.count || 0) + 1
    };
    localStorage.setItem('pageLoads', JSON.stringify(pageLoads));
  }
}; 