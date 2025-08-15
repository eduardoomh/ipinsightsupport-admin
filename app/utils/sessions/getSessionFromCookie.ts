import { base64UrlDecode } from "./base64UrlDecode";

interface SessionPayload {
    id?: string;
    role?: string;
    email?: string;
    name?: string;
}

export async function getSessionFromCookie(request: Request): Promise<SessionPayload | null> {
    const cookieHeader = request.headers.get("Cookie");

    if (!cookieHeader) return null

    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
            const [key, ...v] = c.split("=");
            return [key, v.join("=")];
        })
    );

    const sessionToken = cookies["__session"];
    if (!sessionToken) return null

    const [payloadBase64] = sessionToken.split(".");
    if (!payloadBase64) return null

    let payloadJson: string;
    try {
        payloadJson = base64UrlDecode(payloadBase64).trim().replace(/[^}\]]+$/, "");
    } catch {
       return null
    }

    try {
        return JSON.parse(payloadJson) as SessionPayload;
    } catch {
       return null
    }
}