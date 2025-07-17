import {
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { ConfigProvider } from "antd";
import { UserContext } from "./context/UserContext";
import { AppModeProvider } from "./context/AppModeContext";
import { getSessionFromCookie } from "./utils/sessions/getSessionFromCookie";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isPublic = ["/login"].includes(pathname);

  if (isPublic) {
    return json({ user: null });
  }

  const session = await getSessionFromCookie(request);
  if (!session) {
    console.log("🟥 No hay sesión, redireccionando a /login");
    return redirect("/login");
  }

  const { userId, role, name, email } = session;
  return json({ user: { userId, role, name, email } });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();
  const isPublic = location.pathname === "/login";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 4
            },
            components: {
              Menu: {
                itemSelectedColor: "#E6F5FB",
                itemSelectedBg: "#00AAE7",
                itemHoverColor: "#000",
                itemHoverBg: "#c3e9f8",
                subMenuItemBg: "transparent"
              },
            },
          }}
        >
          {
            isPublic ? (
              <>
                {children}
              </>
            ) : (
              <UserContext.Provider value={data.user}>
                <AppModeProvider>
                  {children}
                </AppModeProvider>
              </UserContext.Provider>
            )
          }
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
