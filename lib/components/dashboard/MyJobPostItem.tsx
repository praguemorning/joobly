"use client"

import React from 'react'
import Button from '../button/button';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';

import DOMPurify from "dompurify";
import { truncateText } from "@/lib/constant/helpers";


const MyJobPostItem = ({ data }: any) => {

  async function handleDeleteClick() {

    const res = await fetch('/api/my-jobs?_id=' + data._id, {
      method: 'DELETE',
    });
    if (res.ok) {
      window.location.reload();
    }
  }

  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-6 justify-between bg-light rounded-lg mb-4 shadow-lg p-6 xl:flex-row lg:gap-8 cursor-pointer hover:shadow-xl duration-200">
      <div className="flex flex-col gap-6 cursor-pointer" onClick={() => router.push(`/jobs/${data._id}`)}>
        <h3 className="text-lg font-bold text-gray-800">{data?.jobTitle}</h3>
        <p className="max-w-[800px]"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(data.description, 200)) }}
        />
      </div>
      <div className="flex flex-col items-end justify-end">
        <div className="flex gap-2 items-center justify-between">
          <Button
            onClick={() => router.push(`/dashboard/job-edit/${data._id}`)}
            className="bg-gray-200 text-gray-500 font-bold text-sm border-2 hover:bg-white hover:border-[#006c53] hover:text-black px-3 py-1 rounded-2xl flex items-center duration-200"

          >
            <MdEdit />
          </Button>
          <Button
            onClick={() => handleDeleteClick()}
            className="bg-red-100 text-red-500 font-bold text-sm border-2 hover:bg-white hover:border-red-500 hover:text-black px-3 py-1 rounded-2xl flex items-center duration-200"
          >
            <MdDelete />
          </Button>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyJobPostItem;