
import { CreateJobPayload } from "@/types/job";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"


export const getJobs = async (query = '') => {
    const res = await fetch(`${BASE_URL}/jobs?${query}`)
    return res.json()
}



export const createJob = async (data: CreateJobPayload) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

// export const deleteJob = async(jobId: string) =>{
//     const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
//         method: 'DELETE'
//     });
    
//     return res.json();
// }