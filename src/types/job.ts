// export interface JobForm {
//   title: string;
//   category: string;
//   type: string;
//  jobType: string;
//   _id: string;
//   location: string;
//   remote: boolean;
//   isRemote: boolean;
//   deadline: string;
//   currency: string;
//   salaryMin: string;
//   salaryMax: string;
//   description: string;
//   responsibilities: string;
//   requirements: string;
//   benefits: string;
// }

// export interface Job extends CreateJobPayload {
//   _id: string;
// }

// export interface CreateJobPayload
//   extends Omit<JobForm, "salaryMin" | "salaryMax"> {
//   salaryMin: number | null;
//   salaryMax: number | null;
//   status: "active" | "draft";
//   createdAt: string;
//    _id: string;
// }

export interface JobForm {
  title: string;
  category: string;
  type: string;
  jobType: string;
  location: string;
   _id: string;
  remote: boolean;
  isRemote: boolean;
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

export interface Job extends CreateJobPayload {
  _id: string;
}