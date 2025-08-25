// app/components/ClientOnlyQuill.tsx
import { useEffect, useState } from "react";

export default function TextEditor({ value, onChange, height }: { value: string; onChange: (val: string) => void, height?: string }) {
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    import("react-quill").then((module) => {
      import("react-quill/dist/quill.snow.css"); // Estilos
      setReactQuill(() => module.default);
    });
  }, []);

  if (!ReactQuill) return <div className="text-sm text-gray-500">Cargando editor...</div>;

  return <ReactQuill className={`mb-12 h-${height || '64'}`} theme="snow" value={value} onChange={onChange} />;
}