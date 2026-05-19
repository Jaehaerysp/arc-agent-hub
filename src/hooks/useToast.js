import { useState, useCallback } from "react";

let id = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info", duration = 4000) => {
    const _id = ++id;
    setToasts(p => [...p, { id: _id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== _id)), duration);
  }, []);

  const dismiss = useCallback((tid) => {
    setToasts(p => p.filter(t => t.id !== tid));
  }, []);

  return { toasts, toast, dismiss };
}
