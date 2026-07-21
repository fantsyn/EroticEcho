import path from "path";

/**
 * Writable data root.
 * - Local: process.cwd()/data
 * - Vercel/Lambda: /tmp (only writable path)
 * - Override: DATA_DIR env
 */
export function getDataDir(): string {
  if (process.env.DATA_DIR?.trim()) {
    return path.resolve(process.env.DATA_DIR.trim());
  }
  const serverless =
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL_ENV != null;
  if (serverless) {
    return path.join("/tmp", "eroticecho-data");
  }
  return path.join(process.cwd(), "data");
}

export function isServerlessRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL_ENV != null
  );
}
