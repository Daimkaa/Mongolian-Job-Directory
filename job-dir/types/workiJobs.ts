export interface WorkiJob {
    name: string;
    id: string;
    addressNames: string[];
    companyName: string;
    salary: {
        min: number;
        max: number;
        option: string;
        negotiate: boolean;
    };
    company: {
        about: {
            logo: string;
        };
    };
}

export interface WorkiResponse {
    data: {
        jobFilter: {
            content: WorkiJob[];
        };
    };
}