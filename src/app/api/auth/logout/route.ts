import authApiRequest from "@/apiRequest/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

const POST = async (request: Request) => {
  const res = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.serverLogin(res);
    const {
      data: { accessToken, refreshToken },
    } = payload;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      expires: decodedAccessToken.exp * 1000,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    cookieStore.set("refreshToken", refreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
  }
};
