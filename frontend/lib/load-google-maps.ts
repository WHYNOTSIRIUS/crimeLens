let isLoading = false;
let isLoaded = false;
let callbacks: (() => void)[] = [];

export function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLoaded) {
      console.log('Google Maps already loaded');
      resolve();
      return;
    }

    // If loading, add to callback queue
    if (isLoading) {
      console.log('Google Maps is currently loading, adding to callback queue');
      callbacks.push(resolve);
      return;
    }

    // Start loading
    console.log('Starting Google Maps script load');
    isLoading = true;

    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization`;
    script.async = true;
    script.defer = true;

    // Handle script load
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      isLoaded = true;
      isLoading = false;
      resolve();
      callbacks.forEach(callback => callback());
      callbacks = [];
    };

    // Handle script error
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
      isLoading = false;
      reject(new Error('Failed to load Google Maps script'));
      callbacks.forEach(callback => callback());
      callbacks = [];
      
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    // Add script to document
    document.head.appendChild(script);
  });
}
