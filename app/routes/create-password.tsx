import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import AuthContainer from "~/components/views/auth/AuthContainer";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Create password | Sentinelux" },
  { name: "description", content: "Create password page from Sentinelux" },
];

export default function CreatePasswordRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState<{ email: string; id: string, type: any } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    const validateToken = async () => {
      const response = await fetch("/api/auth/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!result.valid) {

      } else {
        setIsValid(true);
        setValues(result.data);
        // Opcionalmente guarda result.user
      }
    };

    validateToken();
  }, [navigate, searchParams]);

  if (!isValid || !values) return null; // o un loading spinner

  return (
    <main className="flex items-center justify-center min-h-screen">
      {/* Mostrar solo si token fue validado */}
      <AuthContainer type="create_password" data={values} />
    </main>
  );
}