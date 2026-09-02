import { handle } from "@/lib/server/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  return handle(request, "action", (await context.params).code);
}
