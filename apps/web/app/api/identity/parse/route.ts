import { jsonError, parseIdentityPayload } from "@/lib/protocol/server";

export async function POST(request: Request) {
  try {
    return Response.json(parseIdentityPayload(await request.json()));
  } catch (error) {
    return jsonError(error);
  }
}
