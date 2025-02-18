import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Job } from '../../../../types/jobs';

export async function GET() {
    try {
        // Fetch Zangia jobs
        const zangiaResponse = await fetch('https://www.zangia.mn/job/list/b.4');
        const html = await zangiaResponse.text();
        const $ = cheerio.load(html);
        const zangiaJobs: Job[] = [];

        $('.list > div').each((index, element) => {
            const $element = $(element);
            const title = $element.find('.ad a b').first().text().trim();
            const company = $element.find('.company a b').text().trim();
            const location = $element.find('.ad .floc, .ad .floca').text().trim();
            const postedDate = $element.find('.ad .sdate').text().trim();
            const logo = $element.find('.company img').attr('src');
            const salary = $element.find('.ad .fsal').text().trim();

            zangiaJobs.push({
                title,
                company,
                salary,
                location,
                postedDate,
                logo: logo ? `https://www.zangia.mn/${logo}` : null
            });
        });

        // Fetch Worki jobs
        const workiResponse = await fetch('http://localhost:3000/api/worki');
        const workiJobs: Job[] = await workiResponse.json();

        // Combine
        const allJobs = [...zangiaJobs, ...workiJobs];

        return NextResponse.json(allJobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json([], { status: 500 });
    }
}