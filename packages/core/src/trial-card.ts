import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const trialCategorySchema = z.enum([
  "reasoning",
  "tool-use",
  "coding",
  "research",
  "web-automation",
  "memory",
  "safety"
]);

export const trialRunStatusSchema = z.enum([
  "planned",
  "mocked",
  "pending",
  "running",
  "completed",
  "failed",
  "rejected"
]);

export const trialVerificationStatusSchema = z.enum([
  "unverified",
  "verified",
  "flagged",
  "blocked"
]);

export const trialScoreSchema = z
  .object({
    label: z.string().min(1),
    score: z.number().min(0).max(100),
    notes: z.array(z.string().min(1)).default([])
  })
  .strict()
  .openapi("TrialScore");

export const trialCardSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    category: trialCategorySchema,
    passportId: z.string().min(1),
    status: trialRunStatusSchema.default("planned"),
    verificationStatus: trialVerificationStatusSchema.default("unverified"),
    summary: z.string().optional(),
    scores: z.array(trialScoreSchema).default([]),
    replayAvailable: z.boolean().default(false),
    reputationImpactAllowed: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict()
  .openapi("TrialCard");

export const trialCardOpenApiRegistry = new OpenAPIRegistry();
trialCardOpenApiRegistry.register("TrialCard", trialCardSchema);

export type TrialCategory = z.infer<typeof trialCategorySchema>;
export type TrialRunStatus = z.infer<typeof trialRunStatusSchema>;
export type TrialVerificationStatus = z.infer<typeof trialVerificationStatusSchema>;
export type TrialScore = z.infer<typeof trialScoreSchema>;
export type TrialCard = z.infer<typeof trialCardSchema>;
