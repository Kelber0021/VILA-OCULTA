import { handle } from "@/lib/server/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  return handle(request, "read", (await context.params).code);
}
