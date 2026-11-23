export interface Source {
    url: string;
    cover: string;
}

export interface Book {
    title: string;
    description: string;
    author: string[]
    source: Source[]
}
