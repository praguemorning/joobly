export function extractId(jobId: string) {
  return jobId.split("-").pop() as string;
}