import type { CreateJobPayload, Job } from "@/types/job";

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


export const getJobById = async (jobId: string): Promise<Job | null> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
    // CHANGE: return null for a missing job, and throw for a real server error.
    // WHY: before, an error response was returned as if it were a job, so the
    // job page never reached notFound().
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`)

    const data = await res.json()
    return data ?? null
}

export const getJobs = async (params?: { recruiterId?: string }): Promise<Job[]> => {
  // CHANGE: filter with ?recruiterId= instead of ?recruiterEmail=.
  // WHY: the backend only reads recruiterId. recruiterEmail was ignored, so the
  // recruiter dashboard received every job in the database.
  const query = params?.recruiterId
    ? `?recruiterId=${encodeURIComponent(params.recruiterId)}`
    : "";
  const res = await fetch(`${BASE_URL}/jobs${query}`); // keep your existing base URL / options

  // CHANGE: throw when the request fails.
  // WHY: before, an error response was returned like a normal list, so the page
  // showed "No jobs yet" instead of its error message.
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

  return res.json();
};




// export const getJobs = () => request("/jobs");

export const getJob = (jobId: string) => request(`/jobs/${jobId}`);

export const updateJob = (jobId: string, data: Partial<CreateJobPayload>) =>
    request(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

export const deleteJob = (jobId: string) =>
    request(`/jobs/${jobId}`, { method: "DELETE" });
