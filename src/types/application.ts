/**
 * Where an application sits in the hiring pipeline.
 * Keep this list in sync with the status pills on the seeker dashboard.
 */
export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

/**
 * One document in the `applications` collection.
 *
 * We store a snapshot of the job (title, type, salary...) next to the
 * applicant, so the dashboard can render a card without joining `jobs`.
 */
export interface JobApplication {
  _id: string;

  // Who applied, and to which job
  jobId: string;
  userId: string;
  applicantName?: string;
  email: string;

  // Job snapshot taken at apply time
  jobTitle: string;
  category?: string;
  jobType?: string;
  location?: string;
  isRemote?: boolean;
  deadline?: string;
  currency?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;

  // What the applicant sent
  resumeUrl?: string;
  coverLetter?: string;

  // Lifecycle
  status: ApplicationStatus;
  archived: boolean;
  appliedAt: string;
  updatedAt?: string;
}

/**
 * What the client sends to `POST /applications`.
 * The server fills in `status`, `archived` and the timestamps when missing.
 */
export type CreateApplicationPayload = Omit<
  JobApplication,
  "_id" | "status" | "archived" | "appliedAt" | "updatedAt"
> & {
  status?: ApplicationStatus;
  archived?: boolean;
  appliedAt?: string;
  updatedAt?: string;
};
