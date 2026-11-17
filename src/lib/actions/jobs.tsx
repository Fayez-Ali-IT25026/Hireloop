
import { CreateJobPayload, Job } from "@/types/job";

// CHANGE: Added a normal fallback URL string.
// WHY: The previous URL was formatted as a Markdown link,
// which is not a valid URL in JavaScript.
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


// CHANGE: Added Promise<Job[]> return type.
// WHY: This function returns an array of Job objects.
export const getJobs = async (query = ""): Promise<Job[]> => {

  // CHANGE: Fetch all jobs without query parameters.
  // WHY: Your backend expects jobType and isRemote as database
  // fields, but MongoDB actually stores type and remote.
  // We fetch all jobs and filter them on the frontend instead.
  const res = await fetch(`${BASE_URL}/jobs`);

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const allJobs: Job[] = await res.json();

  // CHANGE: Read filter values from the URL.
  // WHY: This allows frontend filtering using URL query parameters.
  const params = new URLSearchParams(query);

  const jobType = params.get("jobType");
  const category = params.get("category");
  const search = params.get("search")?.toLowerCase();
  const isRemote = params.get("isRemote");

  // CHANGE: Apply filters in the frontend.
  // WHY: Use the actual MongoDB property names:
  // type, category and remote.
  const filteredJobs = allJobs.filter((job) => {

    // Filter by job type
    if (jobType && job.type !== jobType) {
      return false;
    }

    // Filter by category
    if (category && job.category !== category) {
      return false;
    }

    // Filter by remote status
    if (
      isRemote !== null &&
      job.remote !== (isRemote === "true")
    ) {
      return false;
    }

    // Search by title, location, description and other fields
    if (search) {
      const searchableText = [
        job.title,
        job.location,
        job.description,
        job.responsibilities,
        job.requirements,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(search)) {
        return false;
      }
    }

    return true;
  });

  return filteredJobs;
};


export const createJob = async (data: CreateJobPayload) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // CHANGE: throw when the server rejects the request.
  // WHY: before, a failed POST still returned JSON, so the page showed
  // "Job published successfully!" even when nothing was saved.
  if (!res.ok) {
    throw new Error(`Failed to create job (${res.status})`);
  }

  return res.json();
};


// export const deleteJob = async(jobId: string) =>{
//     const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
//         method: 'DELETE'
//     });

//     return res.json();
// }
