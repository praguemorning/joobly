import { UserProfileTypes } from '@/models/User';
import { useState, useEffect } from 'react'

type UserDataTypes = {
    data: UserProfileTypes;
};


export const useProfile = () => {
    const [data, setData] = useState<UserDataTypes | any>(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true);
        fetch('/jobs/api/profile').then(response => {
            response.json().then(data => {
                setData(data);
                setLoading(false);
            });
        })
    }, []);
  return {loading, data};
}