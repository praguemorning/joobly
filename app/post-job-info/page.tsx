'use client'
import styles from "./postJobInfo.module.scss";
import bg from "@/public/images/postJobInfoBg.svg";
import dashboard from "@/public/images/Dashboard.svg";
//import chart from "@/public/images/Chart.svg";
import greenDashboardMin from "@/public/images/greenDashboardMin.png";
import greenDashboardMax from "@/public/images/greenDashboardMax.png";
import employerLoptop from "@/public/images/employerLoptop.png";
import checkMark from "@/public/images/icons/checkmark.svg";
import checkMarkLight from "@/public/images/icons/checkmarkLight.svg";
import PostJobActions from "@/lib/components/postJobActions/postJobActions";
import Button from "@/lib/components/button/button";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { POST_JOB_ACTIONS_SECTION_1, POST_JOB_ACTIONS_SECTION_2 } from '@/lib/constant/constants';
import { useProfile } from '@/lib/hooks/useProfile';
import toast from 'react-hot-toast';

const PostJobInfo = () => {
  const profile = useProfile();
  const jobPostPoints = profile?.data?.jobPostPoints as number;

  const {push} = useRouter();

   function postJobInfoMessage(text: string) {
      toast((t) => (
        <div className="flex flex-col gap-4 text-[#006c53] text-center items-center mb-2">
          <span className="font-medium">
            {text}
          </span>
        </div>
      ))
  };

  return (
    <section className={styles["post-job-info"]}>
      <div style={{backgroundImage: `url(${bg.src})`}} className={styles["post-job-info__top"]}>
        <div className={styles["post-job-info__top__content"]}>
          <h1>Post jobs directly </h1>
          <h4>Publish your vacancies and start receiving applications.</h4>
          <PostJobActions data={POST_JOB_ACTIONS_SECTION_1} image={checkMarkLight} color="white"/>
          {profile && jobPostPoints > 0 ? (
              <Button onClick={()=>push("/post-job")} style={{marginTop:"35px"}} className={`btn-secondary-search`} icon="/images/icons/note.svg" hoverIcon="/images/icons/list-white.svg">
                Post a Job
              </Button>
          ) : profile && jobPostPoints === 0 ? (
            <Button onClick={()=>push("/payment")} style={{marginTop:"35px"}} className={`btn-secondary-search`} icon="/images/icons/note.svg" hoverIcon="/images/icons/list-white.svg">
              Post a Job
            </Button>
          ) : (
            <Button onClick={() => postJobInfoMessage('To post a job you need to be logged in')} 
            style={{marginTop:"35px"}} className={`btn-secondary-search`} icon="/images/icons/note.svg" hoverIcon="/images/icons/list-white.svg">
                Post a Job
            </Button>
          )}
        </div>
        <Image src={greenDashboardMax} width={565} alt="dashboard image"/>
      </div>
      <div className={styles["post-job-info__bottom"]}>
        <Image src={employerLoptop} width={570} alt="employer"/>
        <div>
          <h1>Automatically index jobs </h1>
          <h4>Jobs already online? Save time and have them
            listed automatically.</h4>
          <PostJobActions data={POST_JOB_ACTIONS_SECTION_2} image={checkMark} color="black"/>
          <Button 
          style={{marginTop: "35px",maxWidth:"210px",width:"100%"}} className={`btn-secondary-search`} icon="/images/icons/note.svg"
                  hoverIcon="/images/icons/list-white.svg">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostJobInfo;