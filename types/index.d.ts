declare type SearchParamProps = {
    params: Promise<{ [key: string]: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

declare interface RegisterProps {
    name?: string;
    email: string;
    password: string;
    image?: string;
    admin?: boolean,
}

declare interface UserTypes {
	name: string;
	email: string;
	image: string;
}
