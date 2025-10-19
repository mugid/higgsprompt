import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { solutions, user, solutionLikes, posts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Get current user session to check if they liked each solution
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const solutionsData = await db
      .select({
        id: solutions.id,
        text: solutions.text,
        modelName: solutions.modelName,
        mediaContent: solutions.mediaContent,
        likes: solutions.likes,
        createdAt: solutions.createdAt,
        postAuthorId: posts.authorId,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          userType: user.userType,
          points: user.points,
        },
      })
      .from(solutions)
      .leftJoin(user, eq(solutions.authorId, user.id))
      .leftJoin(posts, eq(solutions.postId, posts.id))
      .where(eq(solutions.postId, postId))
      .orderBy(desc(solutions.createdAt));

    // Check if current user liked each solution and if they can like it
    const solutionsWithLikes = await Promise.all(
      solutionsData.map(async (solution) => {
        let isLiked = false;
        let canLike = false;
        
        if (session?.user) {
          // Check if user is the post creator (only post creators can like solutions)
          canLike = solution.postAuthorId === session.user.id;
          
          if (canLike) {
            const like = await db
              .select()
              .from(solutionLikes)
              .where(and(eq(solutionLikes.solutionId, solution.id), eq(solutionLikes.userId, session.user.id)))
              .limit(1);
            isLiked = like.length > 0;
          }
        }
        return { ...solution, isLiked, canLike };
      })
    );

    return NextResponse.json(solutionsWithLikes);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, modelName, mediaContent, postId } = await request.json();

    if (!text || !modelName || !postId) {
      return NextResponse.json(
        { error: "Text, model name, and post ID are required" },
        { status: 400 }
      );
    }

    const solutionId = crypto.randomUUID();

    await db.insert(solutions).values({
      id: solutionId,
      text,
      modelName,
      mediaContent: mediaContent || [],
      authorId: session.user.id,
      postId,
    });

    return NextResponse.json({ success: true, id: solutionId });
  } catch (error) {
    console.error("Error creating solution:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
}
