import { cookies } from "next/headers";
import authApiRequest from "@/apiRequest/auth";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Can not find token",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.serverLogout({
      refreshToken,
      accessToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong",
      },
      {
        status: 200,
      }
    );
  }
}
