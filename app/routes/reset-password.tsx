import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import AuthContainer from "~/components/views/auth/AuthContainer";

export default function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

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
        navigate("/login");
      } else {
        setIsValid(true);
        setUser(result.user);
        // Opcionalmente guarda result.user
      }
    };

    validateToken();
  }, [navigate, searchParams]);

  if (!isValid || !user) return null; // o un loading spinner

  return (
    <main className="flex items-center justify-center min-h-screen">
      {/* Mostrar solo si token fue validado */}
      <AuthContainer type="reset_password" user={user} />
    </main>
  );
}