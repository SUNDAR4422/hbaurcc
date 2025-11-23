import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const Hcaptcha = forwardRef(({ sitekey, onVerify }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const isResettingRef = useRef(false);

  // Expose resetCaptcha to parent
  useImperativeHandle(ref, () => ({
    resetCaptcha: () => {
      if (window.hcaptcha && widgetIdRef.current !== null) {
        isResettingRef.current = true;

        try {
          window.hcaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.warn('hCaptcha reset warning:', e);
        }

        setTimeout(() => {
          isResettingRef.current = false;
        }, 500);
      }
    }
  }));

  useEffect(() => {
    let scriptLoadHandler = null;

    const loadAndRenderCaptcha = () => {
      if (window.hcaptcha) {
        renderCaptcha();
        return;
      }

      const existingScript = document.querySelector('script[src*="hcaptcha.com"]');
      if (existingScript) {
        scriptLoadHandler = () => {
          if (window.hcaptcha) renderCaptcha();
        };
        existingScript.addEventListener('load', scriptLoadHandler);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;

      scriptLoadHandler = () => {
        if (window.hcaptcha) renderCaptcha();
      };

      script.addEventListener('load', scriptLoadHandler);
      document.head.appendChild(script);
    };

    const renderCaptcha = () => {
      if (!containerRef.current) return;

      try {
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey,
          callback: (token) => onVerify(token),
          'expired-callback': () => {
            if (!isResettingRef.current) onVerify('');
          },
          'error-callback': () => {
            if (!isResettingRef.current) onVerify('');
          }
        });
      } catch (error) {
        console.error("Captcha render error:", error);
      }
    };

    loadAndRenderCaptcha();

    return () => {
      if (scriptLoadHandler) {
        const script = document.querySelector('script[src*="hcaptcha.com"]');
        if (script) script.removeEventListener('load', scriptLoadHandler);
      }
      if (window.hcaptcha && widgetIdRef.current) {
        try { window.hcaptcha.remove(widgetIdRef.current); } catch {}
      }
    };
  }, [sitekey, onVerify]);

  return (
    <div 
      ref={containerRef}
      style={{ display: 'flex', justifyContent: 'center', minHeight: '78px', marginTop: '10px' }}
    />
  );
});

Hcaptcha.displayName = 'Hcaptcha';
export default Hcaptcha;
