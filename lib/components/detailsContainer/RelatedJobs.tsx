"use client";
import React,{useEffect, useState} from "react";
import Paper from "@/lib/components/paper/Paper";
import styles from "./deatilsContainer.module.scss";
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import {AccessTime as AccessTimeIcon} from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";

interface RelatedJob {
  _id: string;
  jobTitle: string;
  jobCategory: string;
  workType: string;
  location: string;
  jobTime: string;
  createdAt: string;
  jobUrl: string;
}

function RelatedJobs({companyName,currentJobId}: {companyName: string,currentJobId:string}) {
  
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);

   useEffect(() => {
    // Fetch related jobs based on companyName
    if(companyName){
      const fetchRelatedJobs = async () => {
          const res = await fetch(`/api/related-jobs/${companyName}`, {
            next: { revalidate: 60 },
          });
          const resData = await res.json();
          if(resData && resData.jobs){
            setRelatedJobs(resData.jobs.filter((x:any)=> x._id !== currentJobId));
          }
      }
      fetchRelatedJobs();
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [companyName]);
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if(relatedJobs.length === 0) {
    return null;
  }
  return (
    <Paper className='details-component-paper' style={{position:"sticky",top:"100px"}}>
      <section className={styles["job-company-details"]} style={{marginTop:0}}>
          <div className="sticky min-w-[200px]">
                    <h2 className="text-md font-semibold text-slate-800 mb-5 flex items-center gap-2">
                      <WorkIcon className="text-blue-600" />
                      This company is also hiring
                    </h2>

                    <div className="space-y-4">
                      {relatedJobs.map((job) => {
                        const slug = slugify(job.jobTitle);
                        return  <Link href={`/jobs/${slug}-${job._id}`}  key={job._id}>
                          <div
                           
                            className="group cursor-pointer hover:bg-slate-50 rounded-xl p-4 transition-all duration-200 border border-slate-100 hover:border-blue-200 hover:shadow-md"
                          >
                            <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {job.jobTitle}
                            </h3>

                            <div className="space-y-2 mb-3">
                              {job.jobCategory &&
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <BusinessIcon className="text-sm text-slate-400" />
                                  <span className="line-clamp-1">{job.jobCategory}</span>
                                </div>
                              }

                              {job.location && 
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <LocationOnIcon className="text-sm text-slate-400" />
                                  <span>{job.location}</span>
                                </div>
                              }


                              {job.jobTime && 
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <AccessTimeIcon className="text-sm text-slate-400" />
                                  <span>{job.jobTime}</span>
                                </div>
                              }
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              {/* <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <ScheduleIcon className="text-sm" />
                                <span>{getTimeAgo(job.createdAt)}</span>
                              </div> */}

                              <a
                                href={job.jobUrl}
                                target="_blank"
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                 <span className="text-xs text-slate-500">Apply here</span>

                                {/* <OpenInNewIcon className="text-sm" /> */}
                              </a>
                            </div>
                          </div>
                        </Link>
                      })}
                    </div>

                   
           </div>
      </section>
    </Paper>
  );
}

export default RelatedJobs;
