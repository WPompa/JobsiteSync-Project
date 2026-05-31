import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import "./css/toast.css";

const ToastContext = createContext(null);

const ANIMATION_DURATION = 200; // Must match the CSS animation-duration
const SWIPE_THRESHOLD = 80;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    if (timersRef.current[`${id}-exiting`]) return;

    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
    }

    timersRef.current[`${id}-exiting`] = true;

    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast,
      ),
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete timersRef.current[id];
      delete timersRef.current[`${id}-exiting`];
    }, ANIMATION_DURATION);
  }, []);

  const addToast = useCallback(
    (message, type = "error", duration = 5000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);

      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  useEffect(() => {
    const handleGlobalToast = (event) => {
      const { message, type } = event.detail;

      addToast(message, type);
    };

    window.addEventListener("global-toast", handleGlobalToast);

    return () => window.removeEventListener("global-toast", handleGlobalToast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <SwipeableToast
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function SwipeableToast({ toast, onDismiss }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startingX = useRef(0);

  const handleTouchStart = (e) => {
    if (toast.isExiting) return;

    startingX.current = e.touches[0].clientX;

    setIsDragging(true);
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || toast.isExiting) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      const currentX = e.touches[0].clientX;
      const diffX = currentX - startingX.current;

      if (diffX > 0) {
        setDragX(diffX);
      }
    },
    [isDragging, toast.isExiting],
  );

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (dragX > SWIPE_THRESHOLD) {
      onDismiss();
    } else {
      setDragX(0);
    }
  };

  const elementRef = useCallback(
    (node) => {
      if (node !== null) {
        node.addEventListener("touchmove", handleTouchMove, { passive: false });
      }
    },
    [handleTouchMove],
  );

  const swipeStyle = toast.isExiting
    ? undefined
    : {
        transform: `translateX(${dragX}px)`,
        opacity: 1 - dragX / 200,
        transition: isDragging
          ? "none"
          : "transform 0.2s ease, opacity 0.2s ease",
      };

  return (
    <div
      className={`toast-wrapper ${toast.isExiting ? "toast-exit" : ""}`}
      ref={elementRef}
    >
      <div
        className={`toast-message toast-${toast.type}`}
        role="alert"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={swipeStyle}
      >
        <span className="toast-icon">
          {toast.type === "error" ? "❌" : "✅"}
        </span>
        <p className="toast-text">{toast.message}</p>
        <button className="toast-close" onClick={onDismiss} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
