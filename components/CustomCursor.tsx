
import React, { useEffect, useState, useRef } from 'react';
import { useConfig } from '../contexts/ConfigContext';

export const CustomCursor: React.FC = () => {
  const { gameState } = useConfig();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable custom cursor if the device has a fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
            setIsVisible(true);
            document.body.classList.add('custom-cursor-enabled');
        } else {
            setIsVisible(false);
            document.body.classList.remove('custom-cursor-enabled');
        }
    };

    // Initial check
    handleMediaChange(mediaQuery);

    // Listen for changes (e.g. connecting a mouse to an iPad)
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange);
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for clickable elements including buttons inside modals
      const clickable = target.closest('button, a, [role="button"], .cursor-pointer');
      
      if (clickable) {
        setIsHovering(true);
        if (clickable.querySelector('video') || clickable.classList.contains('has-video') || clickable.classList.contains('is-game')) {
          setHoverType('PLAY');
        } else if (clickable.classList.contains('portfolio-card')) {
          setHoverType('VIEW');
        } else {
          setHoverType(null);
        }
      } else {
        setIsHovering(false);
        setHoverType(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    
    return () => {
      if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-300 ease-out flex items-center justify-center overflow-hidden
        ${gameState.mode === 'logic' ? 'w-8 h-8 rounded-none border-2 border-stone-900 bg-transparent' : 'w-4 h-4 bg-accent rounded-full'}`}
      style={{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${isHovering ? 3 : 1})`,
        mixBlendMode: gameState.mode === 'logic' ? 'normal' : 'difference'
      }}
    >
      {gameState.mode === 'logic' && (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-stone-900/20" />
            <div className="h-full w-[1px] bg-stone-900/20 absolute" />
        </div>
      )}
      {isHovering && hoverType && (
        <span className={`text-[3px] font-black uppercase tracking-tighter animate-in fade-in duration-300 ${gameState.mode === 'logic' ? 'text-stone-900' : 'text-white'}`}>
          {hoverType}
        </span>
      )}
    </div>
  );
};
