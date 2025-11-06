'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import TopHeader from '@/lib/components/header/header';
import HeaderBackground from '@/lib/components/headerBackground/headerBackground';
import { SessionProvider } from "next-auth/react";

interface HeaderProps {
    topHeaderTitle?: string,
    bottomHeaderTitle?: string
    needBackgroundHeader?: boolean,
    extraBottomHeader?: string | undefined
}
const Header: React.FC<HeaderProps> = ({ topHeaderTitle, bottomHeaderTitle, needBackgroundHeader = true, extraBottomHeader }) => {
    const pathname = usePathname();

    return (
        pathname !== '/main' ?
            <>
                <SessionProvider>
                    <TopHeader />
                    {needBackgroundHeader && pathname !== '/dashboard/admin' && (
                        <HeaderBackground
                            extraBottomHeader={extraBottomHeader}
                            topHeaderTitle={topHeaderTitle}
                            bottomHeaderTitle={bottomHeaderTitle}
                        />
                    )}
                </SessionProvider>
            </>
            : null

    );
};

export default Header;
