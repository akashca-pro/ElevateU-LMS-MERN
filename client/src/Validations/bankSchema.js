import { z } from "zod"

const bankSchema = z.object({
  accountNumber: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number must be at most 18 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  bankName: z
    .string()
    .min(1, "Bank name is required")
    .max(50, "Bank name must be under 50 characters"),
  holderName: z
    .string()
    .min(1, "Account holder name is required")
    .regex(/^[a-zA-Z\s]+$/, "Holder name must only contain letters and spaces"),
})

export default bankSchema