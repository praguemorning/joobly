import { UserProfileTypes } from '@/models/User';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react'

type UserDataTypes = {
    data: UserProfileTypes;
};


export const useProfile = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const [data, setData] = useState<UserDataTypes | any>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            setData({});
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch('/jobs/api/profile')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => {
                setData({});
                setLoading(false);
            });
    }, [isLoaded, isSignedIn]);

  return {loading, data};
}
