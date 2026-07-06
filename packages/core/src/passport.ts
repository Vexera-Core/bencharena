import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const agentSourceSchema = z.enum([
  "manual",
  "agents-md",
  "local-config",
  "runtime-export",
  "preset"
]);

export const trustBoundarySchema = z.enum([
  "agent-input",
  "tool",
  "filesystem",
  "memory",
  "wallet",
  "result"
]);

export const permissionBoundarySchema = z.enum([
  "none",
  "read-only-filesystem",
  "scoped-filesystem",
  "network",
  "shell",
  "wallet",
  "external-api"
]);

export const memoryPolicySchema = z.enum([
  "none",
  "summary-only",
  "scoped-export",
  "raw-upload-blocked"
]);

export const securityStatusSchema = z.enum([
  "draft",
  "needs-review",
  "blocked",
  "verified"
]);

export const benchmarkEligibilitySchema = z.enum([
  "not-eligible",
  "mock-trials",
  "local-trials",
  "hosted-trials",
  "public-competition"
]);

export const securityFindingSeveritySchema = z.enum(["info", "warning", "critical"]);

export const sourceReferenceSchema = z
  .object({
    type: agentSourceSchema,
    label: z.string().min(1),
    uri: z.string().optional(),
    digest: z.string().optional()
  })
  .strict()
  .openapi("SourceReference");

export const securityFindingSchema = z
  .object({
    id: z.string().min(1),
    boundary: trustBoundarySchema,
    severity: securityFindingSeveritySchema,
    title: z.string().min(1),
    detail: z.string().optional()
  })
  .strict()
  .openapi("SecurityFinding");

export const runtimeAssumptionSchema = z
  .object({
    runtime: z.string().min(1),
    version: z.string().optional(),
    environment: z.enum(["local", "hosted", "hybrid"]).default("local")
  })
  .strict()
  .openapi("RuntimeAssumption");

export const toolDescriptorSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    permissions: z.array(permissionBoundarySchema).default([])
  })
  .strict()
  .openapi("ToolDescriptor");

export const agentPassportSchema = z
  .object({
    id: z.string().min(1),
    displayName: z.string().min(1),
    source: agentSourceSchema,
    sourceReference: sourceReferenceSchema.optional(),
    summary: z.string().optional(),
    runtime: runtimeAssumptionSchema,
    tools: z.array(toolDescriptorSchema).default([]),
    permissions: z.array(permissionBoundarySchema).default([]),
    memoryPolicy: memoryPolicySchema.default("raw-upload-blocked"),
    securityStatus: securityStatusSchema.default("draft"),
    securityFindings: z.array(securityFindingSchema).default([]),
    benchmarkEligibility: benchmarkEligibilitySchema.default("not-eligible"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict()
  .openapi("AgentPassport");

export const agentPassportOpenApiRegistry = new OpenAPIRegistry();
agentPassportOpenApiRegistry.register("AgentPassport", agentPassportSchema);

export type AgentSource = z.infer<typeof agentSourceSchema>;
export type TrustBoundary = z.infer<typeof trustBoundarySchema>;
export type PermissionBoundary = z.infer<typeof permissionBoundarySchema>;
export type MemoryPolicy = z.infer<typeof memoryPolicySchema>;
export type SecurityStatus = z.infer<typeof securityStatusSchema>;
export type BenchmarkEligibility = z.infer<typeof benchmarkEligibilitySchema>;
export type SecurityFindingSeverity = z.infer<typeof securityFindingSeveritySchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type SecurityFinding = z.infer<typeof securityFindingSchema>;
export type RuntimeAssumption = z.infer<typeof runtimeAssumptionSchema>;
export type ToolDescriptor = z.infer<typeof toolDescriptorSchema>;
export type AgentPassport = z.infer<typeof agentPassportSchema>;
