import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const leaders = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        points: user.points,
        userType: user.userType,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.userType, "prompt_engineer"))
      .orderBy(desc(user.points))
      .limit(50);

    return NextResponse.json(leaders);
  } catch (error) {
    console.error("Error fetching leaders:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaders" },
      { status: 500 }
    );
  }
}
