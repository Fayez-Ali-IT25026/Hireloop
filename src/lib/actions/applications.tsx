import type {
    CreateApplicationPayload,
    JobApplication,
} from "@/types/application";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"



export const getApplications = async (query = ""): Promise<JobApplication[]> => {
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()
}



export const createApplication = async (data: CreateApplicationPayload) => {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    return res.json()
}
