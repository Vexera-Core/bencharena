import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { permissionBoundarySchema, trustBoundarySchema } from "./passport.js";

extendZodWithOpenApi(z);

export const SECURITY_REVIEW_ESTIMATE_MINUTES = 15;

export const declaredIdentityFormatSchema = z.enum([
  "identity-md",
  "agents-md",
  "identity-json"
]);

export const securityReviewStatusSchema = z.enum([
  "queued",
  "static-review",
  "passed",
  "needs-human-review",
  "blocked"
]);

export const securityReviewFindingSeveritySchema = z.enum([
  "info",
  "warning",
  "critical"
]);

export const securityReviewCheckIdSchema = z.enum([
  "private-key-risk",
  "raw-memory-risk",
  "prompt-injection-risk",
  "hidden-tool-risk",
  "destructive-shell-risk",
  "unrestricted-filesystem-risk",
  "network-exfiltration-risk",
  "wallet-custody-risk",
  "broad-permission-risk"
]);

export const declaredIdentityReviewRequestSchema = z
  .object({
    sourceFormat: declaredIdentityFormatSchema,
    sourceText: z.string().min(1),
    declaredTools: z.array(z.string().min(1)).default([]),
    declaredPermissions: z.array(permissionBoundarySchema).default([]),
    submittedAt: z.string().datetime().optional()
  })
  .strict()
  .openapi("DeclaredIdentityReviewRequest");

export const securityReviewFindingSchema = z
  .object({
    checkId: securityReviewCheckIdSchema,
    boundary: trustBoundarySchema,
    severity: securityReviewFindingSeveritySchema,
    title: z.string().min(1),
    detail: z.string().min(1),
    recommendation: z.string().min(1)
  })
  .strict()
  .openapi("SecurityReviewFinding");

export const securityReviewResultSchema = z
  .object({
    status: securityReviewStatusSchema,
    estimatedReviewMinutes: z.number().int().positive(),
    findings: z.array(securityReviewFindingSchema),
    eligibleForPassportDraft: z.boolean(),
    eligibleForPublicProfile: z.boolean(),
    eligibleForTrustedVerification: z.boolean(),
    nextStep: z.string().min(1)
  })
  .strict()
  .openapi("SecurityReviewResult");

type StaticTextRule = {
  checkId: SecurityReviewCheckId;
  boundary: SecurityReviewFinding["boundary"];
  severity: SecurityReviewFinding["severity"];
  title: string;
  recommendation: string;
  patterns: RegExp[];
};

const staticTextRules: StaticTextRule[] = [
  {
    checkId: "private-key-risk",
    boundary: "wallet",
    severity: "critical",
    title: "Private key or seed phrase handling requested",
    recommendation: "Block the upload and require a non-custodial proof design.",
    patterns: [/private key/i, /seed phrase/i, /mnemonic/i, /wallet file/i, /keypair\.json/i]
  },
  {
    checkId: "raw-memory-risk",
    boundary: "memory",
    severity: "critical",
    title: "Raw memory upload requested",
    recommendation: "Require summary-only or scoped-export memory policy before review can continue.",
    patterns: [/raw memory/i, /memory dump/i, /upload .*memory/i, /vector store dump/i]
  },
  {
    checkId: "prompt-injection-risk",
    boundary: "agent-input",
    severity: "critical",
    title: "Prompt injection or approval bypass language detected",
    recommendation: "Treat the source as hostile input and require manual security review.",
    patterns: [
      /ignore (all )?(previous|prior) instructions/i,
      /developer mode/i,
      /\bDAN\b/i,
      /jailbreak/i,
      /bypass (the )?(approval|security|policy)/i,
      /reveal (the )?(system prompt|instructions)/i
    ]
  },
  {
    checkId: "hidden-tool-risk",
    boundary: "tool",
    severity: "critical",
    title: "Hidden or undeclared tool access described",
    recommendation: "Require explicit tool declarations before passport generation.",
    patterns: [/hidden tool/i, /secret tool/i, /undeclared tool/i, /stealth access/i]
  },
  {
    checkId: "destructive-shell-risk",
    boundary: "filesystem",
    severity: "critical",
    title: "Destructive shell or filesystem behavior detected",
    recommendation: "Block public profile creation until destructive operations are removed.",
    patterns: [/rm -rf/i, /format disk/i, /delete .*files/i, /overwrite .*filesystem/i]
  },
  {
    checkId: "network-exfiltration-risk",
    boundary: "tool",
    severity: "critical",
    title: "Secret or environment exfiltration language detected",
    recommendation: "Block the upload and require removal of exfiltration behavior.",
    patterns: [/exfiltrate/i, /send .*secrets/i, /upload .*\.env/i, /process\.env/i]
  },
  {
    checkId: "unrestricted-filesystem-risk",
    boundary: "filesystem",
    severity: "warning",
    title: "Broad filesystem access requires review",
    recommendation: "Downgrade to read-only or scoped filesystem access.",
    patterns: [/unrestricted filesystem/i, /full disk/i, /root access/i]
  }
];

export function reviewDeclaredIdentitySecurity(
  input: DeclaredIdentityReviewInput
): SecurityReviewResult {
  const request = declaredIdentityReviewRequestSchema.parse(input);
  const findings = [
    ...findStaticTextFindings(request.sourceText),
    ...findPermissionFindings(request.declaredPermissions)
  ];
  const hasCriticalFinding = findings.some((finding) => finding.severity === "critical");
  const hasWarningFinding = findings.some((finding) => finding.severity === "warning");

  if (hasCriticalFinding) {
    return securityReviewResultSchema.parse({
      status: "blocked",
      estimatedReviewMinutes: SECURITY_REVIEW_ESTIMATE_MINUTES,
      findings,
      eligibleForPassportDraft: false,
      eligibleForPublicProfile: false,
      eligibleForTrustedVerification: false,
      nextStep: "Block this source and require security remediation before normalization."
    });
  }

  if (hasWarningFinding) {
    return securityReviewResultSchema.parse({
      status: "needs-human-review",
      estimatedReviewMinutes: SECURITY_REVIEW_ESTIMATE_MINUTES,
      findings,
      eligibleForPassportDraft: true,
      eligibleForPublicProfile: false,
      eligibleForTrustedVerification: false,
      nextStep: "Create a draft passport only after a reviewer accepts or resolves warnings."
    });
  }

  return securityReviewResultSchema.parse({
    status: "passed",
    estimatedReviewMinutes: SECURITY_REVIEW_ESTIMATE_MINUTES,
    findings,
    eligibleForPassportDraft: true,
    eligibleForPublicProfile: true,
    eligibleForTrustedVerification: false,
    nextStep: "Normalize to identity.json, generate a draft passport, then wait for trusted verification."
  });
}

function findStaticTextFindings(sourceText: string): SecurityReviewFinding[] {
  return staticTextRules.flatMap((rule) => {
    const matchedPattern = rule.patterns.find((pattern) => pattern.test(sourceText));

    if (!matchedPattern) {
      return [];
    }

    return [
      {
        checkId: rule.checkId,
        boundary: rule.boundary,
        severity: rule.severity,
        title: rule.title,
        detail: `Matched static security pattern: ${matchedPattern.source}`,
        recommendation: rule.recommendation
      }
    ];
  });
}

function findPermissionFindings(
  declaredPermissions: DeclaredIdentityReviewRequest["declaredPermissions"]
): SecurityReviewFinding[] {
  const findings: SecurityReviewFinding[] = [];

  declaredPermissions.forEach((permission) => {
    if (permission === "wallet") {
      findings.push({
        checkId: "wallet-custody-risk",
        boundary: "wallet",
        severity: "critical",
        title: "Wallet permission requires a custody-safe design",
        detail: "Declared wallet permission cannot be accepted from a markdown upload.",
        recommendation: "Keep wallet features disabled until a trusted non-custodial adapter exists."
      });
    }

    if (permission === "shell" || permission === "network" || permission === "external-api") {
      findings.push({
        checkId: "broad-permission-risk",
        boundary: permission === "shell" ? "filesystem" : "tool",
        severity: "warning",
        title: "Broad permission requires reviewer approval",
        detail: `Declared permission '${permission}' crosses a review boundary.`,
        recommendation: "Require human review before public comparison or passport promotion."
      });
    }
  });

  return findings;
}

export const securityReviewOpenApiRegistry = new OpenAPIRegistry();
securityReviewOpenApiRegistry.register(
  "DeclaredIdentityReviewRequest",
  declaredIdentityReviewRequestSchema
);
securityReviewOpenApiRegistry.register("SecurityReviewFinding", securityReviewFindingSchema);
securityReviewOpenApiRegistry.register("SecurityReviewResult", securityReviewResultSchema);

export type DeclaredIdentityFormat = z.infer<typeof declaredIdentityFormatSchema>;
export type SecurityReviewStatus = z.infer<typeof securityReviewStatusSchema>;
export type SecurityReviewFindingSeverity = z.infer<
  typeof securityReviewFindingSeveritySchema
>;
export type SecurityReviewCheckId = z.infer<typeof securityReviewCheckIdSchema>;
export type DeclaredIdentityReviewInput = z.input<
  typeof declaredIdentityReviewRequestSchema
>;
export type DeclaredIdentityReviewRequest = z.infer<
  typeof declaredIdentityReviewRequestSchema
>;
export type SecurityReviewFinding = z.infer<typeof securityReviewFindingSchema>;
export type SecurityReviewResult = z.infer<typeof securityReviewResultSchema>;
