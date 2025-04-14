
import { useEffect } from 'react';

const WhatsAppWidget = () => {
  useEffect(() => {
    // Ensure we don't add duplicate scripts
    if (!document.getElementById('elfsight-whatsapp-script')) {
      const script = document.createElement('script');
      script.id = 'elfsight-whatsapp-script';
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="elfsight-app-f0095a36-5eab-4d79-b3af-4db4ab939a8b" 
      data-elfsight-app-lazy 
    />
  );
};

export default WhatsAppWidget;
