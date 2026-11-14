import { getJobs } from '@/lib/actions/jobs';
import React from 'react';

const jobsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {


    const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>)
    const query = urlSearch.toString()

    console.log("Search params:", query)

 const jobs = await getJobs(query);

    return (
        <div>
            <h1>Jobs</h1>
            <ul>
                {jobs.map((job: any) => (
                    <li key={job.id}>{job.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default jobsPage;