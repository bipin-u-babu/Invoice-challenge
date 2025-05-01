import { useEffect, useState } from "react";

export function useUnsavedChangesWarning(shouldWarn: boolean) {
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    localStorage.setItem("shouldWarn", String(shouldWarn));

    const handleBeforeUnload = (e: any) => {
      if (shouldWarn) {
        e.returnValue = "_";
        setIsBlocking(true);
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);

  return {
    isBlocking,
  };
}
