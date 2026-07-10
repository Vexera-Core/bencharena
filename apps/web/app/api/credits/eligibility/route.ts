import { creditEligibilityPayload, jsonError } from "@/lib/protocol/server";

export async function POST(request: Request) {
  try {
    return Response.json(creditEligibilityPayload(await request.json()));
  } catch (error) {
    return jsonError(error);
  }
}
