export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  // Analytics tracking
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  
  console.log('Event:', eventName, properties);
}

export function trackPageView(url: string) {
  trackEvent('page_view', { page_path: url });
}

export function trackError(error: Error, context?: Record<string, any>) {
  console.error('Error tracked:', error, context);
  
  // Send to error tracking service (Sentry, etc.)
  if ((window as any).Sentry) {
    (window as any).Sentry.captureException(error, { extra: context });
  }
}

export function measurePerformance(metricName: string, value: number) {
  if (typeof window === 'undefined') return;
  
  console.log(`Performance: ${metricName} = ${value}ms`);
  
  trackEvent('performance_metric', {
    metric_name: metricName,
    value,
  });
}

export async function reportWebVitals() {
  if (typeof window === 'undefined') return;
  
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    
    getCLS((metric) => measurePerformance('CLS', metric.value));
    getFID((metric) => measurePerformance('FID', metric.value));
    getFCP((metric) => measurePerformance('FCP', metric.value));
    getLCP((metric) => measurePerformance('LCP', metric.value));
    getTTFB((metric) => measurePerformance('TTFB', metric.value));
  } catch (error) {
    console.error('Failed to report web vitals:', error);
  }
}
