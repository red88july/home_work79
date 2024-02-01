export interface Categories {
    categories: string;
    description?: string;
}

export interface Locations {
    location: string;
    description?: string;
}

export interface Items {
    category_id: number;
    location_id: number;
    item: string;
    description?: string;
}