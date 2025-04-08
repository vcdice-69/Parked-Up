/**
 * Report Web Vitals Performance Metrics
 *
 * This file is used to report key performance metrics of the app, such as:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTFB (Time to First Byte)
 * 
 * The function `reportWebVitals` is designed to import and invoke the relevant
 * web vitals measurement functions from the `web-vitals` library to track the
 * performance of the application. The function accepts a callback function 
 * (`onPerfEntry`) that will handle the reported metrics.
 * 
 * By default, these metrics are logged to the console. However, you can modify 
 * the callback to send the performance data to an analytics endpoint, or store 
 * it for further analysis.
 * 
 * Usage Example:
 * 
 * reportWebVitals((metric) => {
 *   console.log(metric);  // Handle the performance data as needed
 * });
 * 
 * @param {function} onPerfEntry - The callback function to handle performance metrics.
 * If provided, it will be called with each performance metric.
 * 
 * @see {@link https://web.dev/vitals/} for more information on Web Vitals and their importance.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Capture and report each web vitals metric.
      getCLS(onPerfEntry);  // Cumulative Layout Shift
      getFID(onPerfEntry);  // First Input Delay
      getFCP(onPerfEntry);  // First Contentful Paint
      getLCP(onPerfEntry);  // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;
