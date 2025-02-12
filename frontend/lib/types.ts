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
