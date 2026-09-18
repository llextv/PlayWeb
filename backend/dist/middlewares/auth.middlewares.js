import { z } from "zod";
import JWT from "../utils/JWT.js";
const JwtPayloadSchema = z.object({
    id: z.string().uuid(),
    iat: z.number().optional(),
    exp: z.number().optional(),
});
export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const headerSchema = z.string().regex(/^Bearer\s+\S+$/i);
    const headerResult = headerSchema.safeParse(authHeader);
    if (!headerResult.success) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized: Missing or invalid token",
        });
    }
    if (!authHeader)
        return;
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    try {
        const decoded = await JWT.decodeToken(token);
        const payloadResult = JwtPayloadSchema.safeParse(decoded);
        if (!payloadResult.success) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized: Invalid token payload",
            });
        }
        req.user = payloadResult.data;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            error: "Unauthorized: Invalid or expired token",
        });
    }
}
