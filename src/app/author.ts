import { Book } from './book';

export interface Author {
    _id?: string,
    name: string,     
    books: Book[] | string[];
}
