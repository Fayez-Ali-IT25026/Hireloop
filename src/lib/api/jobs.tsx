import type { CreateJobPayload } from "@/types/job";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request(path: string, options?: RequestInit) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "content-type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
}

export const getJobs = () => request("/jobs");

export const getJob = (jobId: string) => request(`/jobs/${jobId}`);

export const updateJob = (jobId: string, data: Partial<CreateJobPayload>) =>
    request(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

export const deleteJob = (jobId: string) =>
    request(`/jobs/${jobId}`, { method: "DELETE" });
