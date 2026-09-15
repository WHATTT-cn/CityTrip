import { useEffect, useState } from "react";

/** 持久化到浏览器 localStorage 的状态 Hook */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 存储已满等异常时静默失败 */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
