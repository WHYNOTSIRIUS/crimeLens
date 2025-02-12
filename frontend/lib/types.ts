export interface User {
    id: string;
    displayName: string;
    email: string;
    phone?: string;
    image?: string;
    bio?: string;
    role?: string;
    contactInfo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CrimeReport {
    id: string;
    title: string;
    description: string;
    location: string;
    reportedBy: User;
    createdAt?: Date;
    updatedAt?: Date;
}
