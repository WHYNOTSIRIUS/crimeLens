export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    bio?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
