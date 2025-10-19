import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { solutions, solutionLikes, user, posts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: solutionId } = await params;
    const userId = session.user.id;

    // Get the solution and its post to check if user is the post creator
    const solutionWithPost = await db
      .select({
        solutionId: solutions.id,
        postAuthorId: posts.authorId,
        solutionAuthorId: solutions.authorId,
      })
      .from(solutions)
      .leftJoin(posts, eq(solutions.postId, posts.id))
      .where(eq(solutions.id, solutionId))
      .limit(1);

    if (solutionWithPost.length === 0) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    const { postAuthorId, solutionAuthorId } = solutionWithPost[0];

    // Check if user is the post creator (only post creators can like solutions)
    if (postAuthorId !== userId) {
      return NextResponse.json({ error: "Only post creators can like solutions" }, { status: 403 });
    }

    // Check if user already liked this solution
    const existingLike = await db
      .select()
      .from(solutionLikes)
      .where(and(eq(solutionLikes.solutionId, solutionId), eq(solutionLikes.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    // Add like to solution_likes table
    await db.insert(solutionLikes).values({
      id: crypto.randomUUID(),
      solutionId,
      userId,
    });

    // Get current likes count and increment it
    const currentSolution = await db
      .select({ likes: solutions.likes, authorId: solutions.authorId })
      .from(solutions)
      .where(eq(solutions.id, solutionId))
      .limit(1);

    if (currentSolution.length > 0) {
      const newLikesCount = (currentSolution[0].likes || 0) + 1;
      
      // Increment likes count on solution
      await db
        .update(solutions)
        .set({ likes: newLikesCount })
        .where(eq(solutions.id, solutionId));

      // Get solution author and increment their points
      const authorId = currentSolution[0].authorId;
      const currentUser = await db
        .select({ points: user.points })
        .from(user)
        .where(eq(user.id, authorId))
        .limit(1);

      if (currentUser.length > 0) {
        const newPoints = (currentUser[0].points || 0) + 1;
        await db
          .update(user)
          .set({ points: newPoints })
          .where(eq(user.id, authorId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking solution:", error);
    return NextResponse.json({ error: "Failed to like solution" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: solutionId } = await params;
    const userId = session.user.id;

    // Get the solution and its post to check if user is the post creator
    const solutionWithPost = await db
      .select({
        solutionId: solutions.id,
        postAuthorId: posts.authorId,
        solutionAuthorId: solutions.authorId,
      })
      .from(solutions)
      .leftJoin(posts, eq(solutions.postId, posts.id))
      .where(eq(solutions.id, solutionId))
      .limit(1);

    if (solutionWithPost.length === 0) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    const { postAuthorId, solutionAuthorId } = solutionWithPost[0];

    // Check if user is the post creator (only post creators can unlike solutions)
    if (postAuthorId !== userId) {
      return NextResponse.json({ error: "Only post creators can unlike solutions" }, { status: 403 });
    }

    // Remove like from solution_likes table
    await db
      .delete(solutionLikes)
      .where(and(eq(solutionLikes.solutionId, solutionId), eq(solutionLikes.userId, userId)));

    // Get current likes count and decrement it
    const currentSolution = await db
      .select({ likes: solutions.likes, authorId: solutions.authorId })
      .from(solutions)
      .where(eq(solutions.id, solutionId))
      .limit(1);

    if (currentSolution.length > 0) {
      const newLikesCount = Math.max((currentSolution[0].likes || 0) - 1, 0);
      
      // Decrement likes count on solution
      await db
        .update(solutions)
        .set({ likes: newLikesCount })
        .where(eq(solutions.id, solutionId));

      // Get solution author and decrement their points
      const authorId = currentSolution[0].authorId;
      const currentUser = await db
        .select({ points: user.points })
        .from(user)
        .where(eq(user.id, authorId))
        .limit(1);

      if (currentUser.length > 0) {
        const newPoints = Math.max((currentUser[0].points || 0) - 1, 0);
        await db
          .update(user)
          .set({ points: newPoints })
          .where(eq(user.id, authorId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking solution:", error);
    return NextResponse.json({ error: "Failed to unlike solution" }, { status: 500 });
  }
}
