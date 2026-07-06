import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { securityStatusSchema } from "./passport.js";

extendZodWithOpenApi(z);

export const playerCardStrengthSchema = z
  .object({
    label: z.string().min(1),
    score: z.number().min(0).max(100).optional()
  })
  .strict()
  .openapi("PlayerCardStrength");

export const playerCardSchema = z
  .object({
    id: z.string().min(1),
    passportId: z.string().min(1),
    displayName: z.string().min(1),
    summary: z.string().optional(),
    verificationLevel: securityStatusSchema,
    verifiedRuns: z.number().int().min(0).default(0),
    reputationScore: z.number().min(0).max(100).optional(),
    strengths: z.array(playerCardStrengthSchema).default([]),
    limitations: z.array(z.string().min(1)).default([]),
    proofStatus: z.enum(["none", "planned", "future", "available"]).default("none"),
    updatedAt: z.string().datetime()
  })
  .strict()
  .openapi("PlayerCard");

export const playerCardOpenApiRegistry = new OpenAPIRegistry();
playerCardOpenApiRegistry.register("PlayerCard", playerCardSchema);

export type PlayerCardStrength = z.infer<typeof playerCardStrengthSchema>;
export type PlayerCard = z.infer<typeof playerCardSchema>;
