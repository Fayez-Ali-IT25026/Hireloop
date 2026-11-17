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
   companyId?: string
    recruiterId: string
  // CHANGE: removed jobType + isRemote + _id from this form type.
  // WHY: MongoDB only stores "type" and "remote". Having both pairs forced
  // every create/update call to send fields nobody reads, and _id does not
  // exist yet when you create a job (that caused the two tsc errors).
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

export interface Job extends CreateJobPayload {
  _id: string;
}