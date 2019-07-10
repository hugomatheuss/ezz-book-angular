import { Author } from './author';

export interface Book {
    id: number;
    name: string;
    description: string;
    author: Author;
}