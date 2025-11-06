"use client"

import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { MdDelete } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const AdminUsersJobs = () => {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<{ [userId: string]: boolean }>({});
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'user' | 'job' | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [searchEmail, setSearchEmail] = useState<string>('');

    const toggleAccordion = (userId: string) => {
        setExpanded(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const usersRes = await fetch('/api/admin/users');
            const jobsRes = await fetch('/api/admin/jobs');
            const usersData = await usersRes.json();
            const jobsData = await jobsRes.json();
            setUsers(usersData.users || []);
            setJobs(jobsData.jobs || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    function openDeleteModal(type: 'user' | 'job', id: string) {
        setModalType(type);
        setPendingDeleteId(id);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setModalType(null);
        setPendingDeleteId(null);
    }

    async function confirmDelete() {
        if (modalType === 'user' && pendingDeleteId) {
            setDeletingUserId(pendingDeleteId);
            closeModal();
            const res = await fetch('/api/admin/users?_id=' + pendingDeleteId, {
                method: 'DELETE',
            });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== pendingDeleteId));
                setJobs(jobs.filter(j => j.jobPostAuthorId !== pendingDeleteId));
            }
            setDeletingUserId(null);
        }
        if (modalType === 'job' && pendingDeleteId) {
            setDeletingJobId(pendingDeleteId);
            closeModal();
            const res = await fetch('/api/admin/jobs?_id=' + pendingDeleteId, {
                method: 'DELETE',
            });
            if (res.ok) {
                setJobs(jobs.filter(j => j._id !== pendingDeleteId));
            }
            setDeletingJobId(null);
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    const filteredUsers = sortedUsers.filter(u =>
        u.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchEmail.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col gap-8">
            <h2 className="text-2xl font-bold mb-4">Users and Jobs</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by email or name"
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
                />
            </div>
            {filteredUsers.map(user => {
                const userJobs = jobs.filter(j => j.jobPostAuthorId === user._id);
                const isOpen = expanded[user._id] || false;
                return (
                    <div key={user._id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{user.name} ({user.email})</h3>
                                <p className="text-sm text-gray-500">ID: {user._id}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Button
                                    onClick={() => openDeleteModal('user', user._id)}
                                    className={`bg-red-100 text-red-500 font-bold text-sm border-2 hover:bg-white hover:border-red-500 hover:text-black px-4 py-2 rounded-2xl flex items-center duration-200 ${deletingUserId === user._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    disabled={deletingUserId === user._id}
                                >
                                    {deletingUserId === user._id ? (
                                        <span className="flex items-center"><MdDelete className="w-6 h-6 mr-2 animate-spin" /> Deleting...</span>
                                    ) : (
                                        <><MdDelete className="w-6 h-6 mr-2" /> Delete User</>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => toggleAccordion(user._id)}
                                    className="bg-gray-100 text-gray-700 font-bold text-sm border-2 hover:bg-white hover:border-[#006c53] hover:text-black px-4 py-2 rounded-2xl flex items-center duration-200"
                                >
                                    {isOpen ? 'Hide Jobs' : `Show Jobs (${userJobs.length})`}
                                </Button>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="ml-4">
                                <h4 className="font-semibold mb-2">Published Jobs:</h4>
                                {userJobs.length === 0 && (
                                    <p className="text-gray-400">No published jobs.</p>
                                )}
                                {userJobs.map(job => (
                                    <div key={job._id} className="flex items-center justify-between bg-light rounded-lg mb-2 p-4">
                                        <div>
                                            <span className="font-bold">{job.jobTitle}</span>
                                            <span className="ml-2 text-gray-500">({job.location})</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Button
                                                onClick={() => router.push(`/dashboard/job-post-preview/${job._id}`)}
                                                className="bg-gray-200 text-gray-500 font-bold text-sm border-2 hover:bg-white hover:border-[#006c53] hover:text-black px-3 py-1 rounded-2xl flex items-center duration-200"
                                            >
                                                Details
                                            </Button>
                                            <button
                                                onClick={() => openDeleteModal('job', job._id)}
                                                className={`w-8 h-8 text-gray-500 cursor-pointer hover:text-[#006c53] duration-300 flex items-center justify-center ${deletingJobId === job._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                disabled={deletingJobId === job._id}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                {deletingJobId === job._id ? (
                                                    <MdDelete className="w-8 h-8 animate-spin" />
                                                ) : (
                                                    <MdDelete className="w-8 h-8" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Do you want to delete this {modalType === 'user' ? 'user' : 'job'}?</h3>
                        <div className="flex gap-4 justify-end">
                            <Button
                                onClick={closeModal}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl font-bold border-2 hover:bg-white hover:border-gray-400 duration-200"
                            >Cancel</Button>
                            <Button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-2xl font-bold border-2 hover:bg-white hover:border-red-500 hover:text-red-500 duration-200"
                            >Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersJobs;
