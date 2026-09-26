import { NextRequest, NextResponse } from "next/server";

function getClerkFrontendApi(): string {
	const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
	if (!key) return "sought-mastiff-17.clerk.accounts.dev";
	try {
		const base64 = key.replace(/^pk_(test|live)_/, "").replace(/\$$/, "");
		const decoded = Buffer.from(base64, "base64").toString("utf-8");
		if (decoded.includes(".")) {
			return decoded.replace(/\$$/, "");
		}
	} catch {}
	return "sought-mastiff-17.clerk.accounts.dev";
}

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Requested-With, Accept, Origin, Clerk-Cookie, X-Clerk-Db-Jwt, X-Clerk-Auth-Reason",
	"Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: CORS_HEADERS,
	});
}

async function handleProxy(req: NextRequest, { params }: { params: { path: string[] } }) {
	const frontendApi = getClerkFrontendApi();
	const path = params.path ? params.path.join("/") : "";
	const search = req.nextUrl.search || "";
	const targetUrl = `https://${frontendApi}/${path}${search}`;

	const forwardHeaders: Record<string, string> = {
		Host: frontendApi,
		Accept: req.headers.get("accept") || "*/*",
		"User-Agent": req.headers.get("user-agent") || "Mozilla/5.0",
	};

	const cookie = req.headers.get("cookie");
	if (cookie) forwardHeaders["Cookie"] = cookie;

	const authHeader = req.headers.get("authorization");
	if (authHeader) forwardHeaders["Authorization"] = authHeader;

	const contentType = req.headers.get("content-type");
	if (contentType) forwardHeaders["Content-Type"] = contentType;

	const clerkDbJwt = req.headers.get("x-clerk-db-jwt");
	if (clerkDbJwt) forwardHeaders["x-clerk-db-jwt"] = clerkDbJwt;

	try {
		let body: BodyInit | undefined;
		if (req.method !== "GET" && req.method !== "HEAD") {
			body = await req.arrayBuffer();
		}

		const response = await fetch(targetUrl, {
			method: req.method,
			headers: forwardHeaders,
			body,
			redirect: "follow",
		});

		const responseHeaders = new Headers();
		for (const [key, value] of Object.entries(CORS_HEADERS)) {
			responseHeaders.set(key, value);
		}

		const headersToForward = [
			"content-type",
			"authorization",
			"location",
			"clerk-cookie",
			"x-clerk-db-jwt",
			"x-clerk-auth-reason",
			"cache-control",
			"expires",
			"pragma",
		];

		headersToForward.forEach((h) => {
			const val = response.headers.get(h);
			if (val) responseHeaders.set(h, val);
		});

		// Forward Set-Cookie headers
		const rawSetCookies = response.headers.getSetCookie?.() || [];
		if (rawSetCookies.length > 0) {
			rawSetCookies.forEach((c) => {
				// Strip domain restriction so cookies work locally on the current host
				const cleanedCookie = c.replace(/Domain=[^;]+;?/gi, "").trim();
				responseHeaders.append("Set-Cookie", cleanedCookie);
			});
		} else {
			const setCookie = response.headers.get("set-cookie");
			if (setCookie) {
				const cleanedCookie = setCookie.replace(/Domain=[^;]+;?/gi, "").trim();
				responseHeaders.set("Set-Cookie", cleanedCookie);
			}
		}

		const data = await response.arrayBuffer();

		return new NextResponse(data, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error: any) {
		console.error("[Clerk Proxy Error]:", error?.message || error);
		return NextResponse.json(
			{
				response: null,
				client: null,
				error: error?.message || "Proxy connection failure",
			},
			{
				status: 200,
				headers: CORS_HEADERS,
			}
		);
	}
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
