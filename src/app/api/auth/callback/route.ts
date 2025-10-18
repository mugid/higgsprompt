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

    // Get user type from URL params
    const url = new URL(request.url);
    const userTypeParam = url.searchParams.get('userType');
    
    if (userTypeParam && ["prompt_engineer", "company"].includes(userTypeParam)) {
      // Update user with the selected type
      await db
        .update(user)
        .set({ userType: userTypeParam as "prompt_engineer" | "company" })
        .where(eq(user.id, session.user.id));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
