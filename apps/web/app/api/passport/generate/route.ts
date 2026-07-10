import { generatePassportPayload, jsonError } from "@/lib/protocol/server";

export async function POST(request: Request) {
  try {
    return Response.json(generatePassportPayload(await request.json()));
  } catch (error) {
    return jsonError(error);
  }
}
