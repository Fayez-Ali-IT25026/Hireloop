"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";

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

    // Application logic will go here.
  };

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