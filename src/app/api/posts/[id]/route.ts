import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    const postData = await db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        type: posts.type,
        images: posts.images,
        published: posts.published,
        createdAt: posts.createdAt,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          userType: user.userType,
          points: user.points,
        },
      })
      .from(posts)
      .leftJoin(user, eq(posts.authorId, user.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (postData.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(postData[0]);
    
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
