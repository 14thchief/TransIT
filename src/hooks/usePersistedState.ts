import { useEffect, useState } from "react";

const usePersistedState = <T>({
  defaultValue,
  storageKey,
}: {
  defaultValue: T | (() => T);
  storageKey: string;
}) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const jsonValue = localStorage.getItem(storageKey);

      if (jsonValue != null) return JSON.parse(jsonValue);
    }
    if (typeof defaultValue === "function") {
      return defaultValue as () => T;
    } else {
      return defaultValue;
    }
  });

  useEffect(()=> {
    
  }, [value])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }, [storageKey, value]);

  return [value, setValue] as [typeof value, typeof setValue];
};

export default usePersistedState;
