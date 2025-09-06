import { useEffect, useState } from 'react';

export const useKeyboardAdjustment = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // If height decreased by more than 150px, assume keyboard is open
      const keyboardOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardOpen);
      setViewportHeight(currentHeight);
    };

    const handleFocusIn = () => {
      // Small delay to allow keyboard to appear
      setTimeout(() => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialHeight - currentHeight;
        setIsKeyboardOpen(heightDifference > 150);
        setViewportHeight(currentHeight);
      }, 300);
    };

    const handleFocusOut = () => {
      // Small delay to allow keyboard to disappear
      setTimeout(() => {
        setIsKeyboardOpen(false);
        setViewportHeight(window.innerHeight);
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return { isKeyboardOpen, viewportHeight };
};