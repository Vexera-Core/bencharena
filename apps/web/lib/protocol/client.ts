import type {
  CreditEligibilityResponse,
  GeneratePassportResponse,
  IdentitySourceFormat,
  ParseIdentityResponse
} from "./server";

export type ParseIdentityRequest = {
  sourceText: string;
  sourceFormat?: IdentitySourceFormat;
};

export type GeneratePassportRequest = ParseIdentityRequest;

export type CreditEligibilityRequest = {
  available_cents?: number;
  starter_deposit_cents?: number;
  benchmark_cost_cents?: number;
  starter_benchmark_already_used?: boolean;
};

export async function parseIdentity(
  request: ParseIdentityRequest
): Promise<ParseIdentityResponse> {
  return postProtocol("/api/identity/parse", request);
}

export async function generatePassport(
  request: GeneratePassportRequest
): Promise<GeneratePassportResponse> {
  return postProtocol("/api/passport/generate", request);
}

export async function checkCreditEligibility(
  request: CreditEligibilityRequest
): Promise<CreditEligibilityResponse> {
  return postProtocol("/api/credits/eligibility", request);
}

async function postProtocol<TRequest, TResponse>(
  endpoint: string,
  request: TRequest
): Promise<TResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const payload = (await response.json()) as TResponse | { error?: string };

  if (!response.ok) {
    const message =
      isProtocolError(payload) && payload.error ? payload.error : "Protocol request failed.";

    throw new Error(message);
  }

  return payload as TResponse;
}

function isProtocolError(payload: unknown): payload is { error?: string } {
  return typeof payload === "object" && payload !== null && "error" in payload;
}
