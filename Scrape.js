import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function scrapeJobs(url) {
    try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs = [];

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

    console.log(JSON.stringify(jobs, null, 2));
    console.log(`Total jobs found: ${jobs.length}`);
} catch (error) {
    console.error('Error scraping jobs:', error);
    }
}

const url = 'https://www.zangia.mn/job/list/b.4';
scrapeJobs(url);