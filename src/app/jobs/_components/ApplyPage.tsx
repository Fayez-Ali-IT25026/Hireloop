"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { createApplication } from "@/lib/actions/applications";
import type { CreateApplicationPayload } from "@/types/application";

interface ApplyPageProps {
  job: Job;
}

const ApplyPage = ({ job }: ApplyPageProps) => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const router = useRouter();

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/signin?redirectTo=/jobs/${job._id}`);
      return;
    }

    else if(user.role === 'seeker'){
            // Save the full application snapshot (job + seeker + lifecycle)
            // so the My Applications page can render with no joins.
            const application: CreateApplicationPayload = {
                jobId: job._id,
                userId: user.id,
                applicantName: user.name,
                email: user.email,

                jobTitle: job.title,
                category: job.category,
                jobType: job.type,
                location: job.location,
                isRemote: job.remote,
                deadline: job.deadline,
                currency: job.currency,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,

                resumeUrl: "",
                coverLetter: "",

                appliedAt: new Date().toISOString(),
                status: "applied",
                archived: false,
            }

            const result = await createApplication(application);
            if(result.insertedId){
                console.log("Application submitted successfully");
                router.push('/jobs')
            }
        }
        else{
            console.log("user is not a job seeker")
        }
    }
  ;

  return (
    <div>
      <Button
        onClick={handleApplyNow}
        disabled={isPending}
        className="mt-4 h-10 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
      >
        Apply for this role
      </Button>
    </div>
  );
};

export default ApplyPage;







// "use client"

// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { Job } from "@/types/job";
// import { Button } from "@/components/ui/button";


// interface ApplyPageProps {
//   job: Job;
//    _id: string;
// }

// const ApplyPage = (job: ApplyPageProps) => {

//   const { data: session, isPending } =
//     authClient.useSession();

//   const user = session?.user;

//     const router = useRouter()
    

//     const handleApplyNow = async() => {
//         if (!user) {
//             router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
//             return
//         }


//     return (
//         <div>
//              <Button onClick={handleApplyNow} className="mt-4 h-10 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500">
//               Apply for this role
//             </Button>
//         </div>
//     );
// };}

// export default ApplyPage;