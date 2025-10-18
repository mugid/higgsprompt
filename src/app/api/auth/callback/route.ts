import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check if user already has a userType set
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].userType) {
      // User already has a type, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user doesn't have a type yet, redirect to type selection
    return NextResponse.redirect(new URL("/select-type", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
