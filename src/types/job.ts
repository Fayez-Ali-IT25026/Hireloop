export interface JobForm {
  title: string;
  category: string;
  type: string;
  location: string;
  remote: boolean;
  deadline: string;
  currency: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

export interface CreateJobPayload
  extends Omit<JobForm, "salaryMin" | "salaryMax"> {
  salaryMin: number | null;
  salaryMax: number | null;
  status: "active" | "draft";
  createdAt: string;
}