import { useEffect, useState } from "react";

export default function ClientOnly({ children }: { children: JSX.Element }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return children;
}