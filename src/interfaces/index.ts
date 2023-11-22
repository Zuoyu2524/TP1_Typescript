export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    score?: number;
    role: 'Admin' | 'Player' | 'Reporter';
    isDeleted: boolean; 
}