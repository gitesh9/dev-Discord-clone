import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ success: true });

	response.cookies.delete("guest_mode");
	response.cookies.delete("demo_user_id");
	response.cookies.delete("guest_account_name");
	response.cookies.delete("guest_persona");

	return response;
}
