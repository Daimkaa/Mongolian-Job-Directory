'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Job } from '../../types/jobs';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mongolian Job Directory</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            {job.logo && (
              <div className="relative h-12 w-12 mb-4">
                <Image 
                  src={job.logo} 
                  alt={`${job.company} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>
            {job.salary && (
              <p className="text-green-600 font-medium">{job.salary}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">{job.postedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}