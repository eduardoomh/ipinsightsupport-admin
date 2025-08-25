import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import "./tailwind.css";
import { ConfigProvider } from "antd";
import { UserContext } from "./context/UserContext";
import { AppModeProvider } from "./context/AppModeContext";
import { getSessionFromCookie } from "./utils/sessions/getSessionFromCookie";
import 'react-quill/dist/quill.snow.css';

// 🧠 Loader del root
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isPublic = ["/login", "/create-password", "/reset-password"].includes(pathname);

  if (isPublic) {
    return json({ user: null });
  }

  const session = await getSessionFromCookie(request);
  if (!session) {
    console.log("🟥 No hay sesión, redireccionando a /login");
    return redirect("/login");
  }

  const { id, role, name, email, company_id } = session;
  return json({ user: { id, role, name, email, company_id } });
}

// 🧱 Layout principal (NO USA HOOKS AQUÍ)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ✅ Hooks van en componente que solo se ejecuta en cliente
function ClientWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();
  const isPublic = location.pathname === "/login";

  return (
    <ConfigProvider
      theme={{
        token: { borderRadius: 4 },
        components: {
          Menu: {
            itemColor: "#fff",  
            itemSelectedColor: "#E6F5FB",
            itemSelectedBg: "#1f72a6",
            itemHoverColor: "#fff",
            itemHoverBg: "#1a6696",
            subMenuItemBg: "transparent"
          }
        }
      }}
    >
      {isPublic ? (
        <>{children}</>
      ) : (
        <UserContext.Provider value={data?.user}>
          <AppModeProvider>
            {children}
          </AppModeProvider>
        </UserContext.Provider>
      )}
    </ConfigProvider>
  );
}

// 🔁 Render de rutas
export default function App() {
  return <Outlet />;
}