import { NextResponse } from 'next/server';
import { WorkiJob } from '../../../../types/workiJobs';
import { Job } from '../../../../types/jobs';

export async function GET() {
    try {
        const response = await fetch('https://graphql.worki.mn/graphql', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'mn-MN',
                'content-type': 'application/json',
                'priority': 'u=1, i',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'Referer': 'https://worki.mn/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: JSON.stringify({
                query: `query JobFilter($name: String, $page: Int, $size: Int, $searchType: String) {
                    jobFilter(name: $name, page: $page, size: $size, searchType: $searchType) {
                        content {
                            name
                            id
                            addressNames
                            companyName
                            salary {
                                min
                                max
                                option
                                negotiate
                            }
                            company {
                                about {
                                    logo
                                }
                            }
                        }
                    }
                }`,
                variables: {
                    name: "",
                    page: 0,
                    size: 20,
                    searchType: "ALL"
                }
            }),
        });

        const workiResponse = await response.json();
        console.log('Worki API Response:', JSON.stringify(workiResponse, null, 2));

        if (!workiResponse.data?.jobFilter?.content) {
            console.error('Invalid response structure:', workiResponse);
            return NextResponse.json([], { status: 500 });
        }

        const jobs: Job[] = workiResponse.data.jobFilter.content.map((workiJob: WorkiJob) => ({
            title: workiJob.name,
            company: workiJob.companyName,
            location: workiJob.addressNames.join(', '),
            salary: workiJob.salary.negotiate 
                ? 'Negotiable' 
                : `${workiJob.salary.min.toLocaleString()}₮ - ${workiJob.salary.max.toLocaleString()}₮`,
            postedDate: 'Recently posted',
            logo: workiJob.company.about.logo ? `https://mtn-prod-bucket.s3.amazonaws.com/${workiJob.company.about.logo}` : null
        }));

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error fetching Worki jobs:', error);
        return NextResponse.json([], { status: 500 });
    }
}