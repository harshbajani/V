import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();
  const vision = await convex.query(api.vision.get, { id: room });

  if (vision?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", {status: 403}); //comment this if invite doesn't work
  }
  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl,
  };
  const session = liveblocks.prepareSession(
    user.id,
    {userInfo}
  )
  if(room) {
    session.allow(room, session.FULL_ACCESS)
  }
  const {status, body} = await session.authorize();
  return new Response(body,{ status })
}
