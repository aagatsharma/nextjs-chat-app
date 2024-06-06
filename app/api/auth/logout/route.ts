import catchAsync from "@/lib/catchAsync";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getCurrentUser from "@/actions/getCurrentUser";
import ApiError from "@/lib/ApiError";
import { db } from "@/lib/db";

export const POST = catchAsync(async (req: Request) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  let token = cookies().get("accessToken")?.value;
  if (!token) {
    throw new ApiError(404, "missing token");
  }

  await db.token.updateMany({
    where: {
      userId: user.id,
    },
    data: {
      blacklisted: true,
    },
  });
  cookies().delete("accessToken");

  return NextResponse.json({ status: "success" });
});
