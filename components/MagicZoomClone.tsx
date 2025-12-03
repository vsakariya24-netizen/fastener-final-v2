import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

interface MagicZoomProps {
  src: string;              // The small image to show initially
  zoomSrc?: string;         // (Optional) A higher-res image for the zoom. Defaults to 'src' if not provided.
  alt?: string;
  zoomLevel?: number;       // Default: 2.5
  glassSize?: number;       // Default: 200px
}

const MagicZoomClone: React.FC<MagicZoomProps> = ({ 
  src, 
  zoomSrc, 
  alt = "", 
  zoomLevel = 2.5, 
  glassSize = 200 
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Reference to the image container
  const imgRef = useRef<HTMLDivElement>(null);

  // Detect Mobile device to adjust offset
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- UNIFIED MOVEMENT LOGIC ---
  const processMovement = (clientX: number, clientY: number) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    // Calculate X/Y relative to the image
    const x = clientX - left;
    const y = clientY - top;

    // Check if we are outside the image
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setCursorPos({ x, y });
    setShowMagnifier(true);
  };

  // --- EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent) => processMovement(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling while dragging inside the image
    // e.preventDefault(); // Note: React passive events might block this, CSS 'touch-action: none' is better
    processMovement(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    processMovement(clientX, clientY);
  };

  // The actual source for the zoomed part
  const activeZoomSrc = zoomSrc || src;

  return (
    <div 
      ref={imgRef}
      className="relative overflow-hidden cursor-crosshair group select-none w-full h-full flex items-center justify-center bg-white"
      style={{ touchAction: 'none' }} // CRITICAL: Stops page scrolling on mobile while dragging
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setShowMagnifier(false)}
    >
      {/* The Base Image */}
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
      />

      {/* Mobile Hint Overlay (Only shows when NOT zooming) */}
      <div className={`absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none transition-opacity duration-300 flex items-center gap-2 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}>
         <ZoomIn size={12} /> {isMobile ? "Touch & Drag" : "Hover to Zoom"}
      </div>

      {/* The Magnifying Glass */}
      {showMagnifier && (
        <div 
          className="absolute z-50 bg-white border-2 border-yellow-500 rounded-full shadow-2xl pointer-events-none"
          style={{
            // 1. POSITIONING
            // On mobile, we subtract 70px from Y so the glass floats ABOVE your finger
            left: `${cursorPos.x - glassSize / 2}px`,
            top: `${cursorPos.y - glassSize / 2 - (isMobile ? 70 : 0)}px`,
            width: `${glassSize}px`,
            height: `${glassSize}px`,

            // 2. BACKGROUND IMAGE (The Zoomed Version)
            backgroundImage: `url('${activeZoomSrc}')`,
            backgroundRepeat: 'no-repeat',
            
            // 3. ZOOM MATH
            // We scale the background size relative to the container size
            backgroundSize: `${(imgRef.current?.offsetWidth || 0) * zoomLevel}px ${(imgRef.current?.offsetHeight || 0) * zoomLevel}px`,
            
            // 4. OFFSET MATH
            // We match the background position to the cursor, but compensated for the glass offset
            backgroundPositionX: `${-cursorPos.x * zoomLevel + glassSize / 2}px`,
            backgroundPositionY: `${-(cursorPos.y) * zoomLevel + glassSize / 2 + (isMobile ? 70 * zoomLevel : 0)}px` 
          }}
        />
      )}
    </div>
  );
};

export default MagicZoomClone;