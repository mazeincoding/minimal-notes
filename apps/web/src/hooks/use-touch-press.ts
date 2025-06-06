import { useState, useCallback, useRef } from "react";

interface UseTouchPressOptions {
  enabled?: boolean;
  duration?: number;
}

export function useTouchPress({
  enabled = true,
  duration = 150,
}: UseTouchPressOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStarted = useRef(false);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      touchStarted.current = true;
      clearExistingTimeout();
      setIsPressed(true);
    },
    [enabled, clearExistingTimeout]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStarted.current) return;
      clearExistingTimeout();
      timeoutRef.current = setTimeout(() => {
        setIsPressed(false);
      }, duration);

      // Reset touchStarted after a longer delay to block mouse events
      setTimeout(() => {
        touchStarted.current = false;
      }, duration + 100);
    },
    [enabled, duration, clearExistingTimeout]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || touchStarted.current) return;
      clearExistingTimeout();
      setIsPressed(true);
    },
    [enabled, clearExistingTimeout]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || touchStarted.current) return;
      clearExistingTimeout();
      timeoutRef.current = setTimeout(() => {
        setIsPressed(false);
      }, duration);
    },
    [enabled, duration, clearExistingTimeout]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || touchStarted.current) return;
      clearExistingTimeout();
      setIsPressed(false);
    },
    [enabled, clearExistingTimeout]
  );

  const handleTouchCancel = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      clearExistingTimeout();
      setIsPressed(false);
      touchStarted.current = false;
    },
    [enabled, clearExistingTimeout]
  );

  const touchPressProps = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  return {
    isPressed,
    touchPressProps,
  };
}
