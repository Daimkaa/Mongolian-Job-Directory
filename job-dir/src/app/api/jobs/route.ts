import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Job } from '../../../../types/jobs';

export async function GET() {
    try {
        const response = await fetch('https://www.zangia.mn/job/list/b.4');
        const html = await response.text();
        const $ = cheerio.load(html);
        const jobs: Job[] = [];

        $('.list > div').each((index, element) => {
            const $element = $(element);
            const title = $element.find('.ad a b').first().text().trim();
            const company = $element.find('.company a b').text().trim();
            const location = $element.find('.ad .floc, .ad .floca').text().trim();
            const postedDate = $element.find('.ad .sdate').text().trim();
            const logo = $element.find('.company img').attr('src');
            const salary = $element.find('.ad .fsal').text().trim();

            jobs.push({
                title,
                company,
                salary,
                location,
                postedDate,
                logo: logo ? `https://www.zangia.mn/${logo}` : null
            });
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json([], { status: 500 });
    }
}