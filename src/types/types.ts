export type CityOption = { label: string; value: string };

export type HotelItem = {
    id: number;
    name: string;
    city: string;
    priceFrom: number;
    rating: number;
    tags: string[];
    img: string;
};

export type SearchState = {
    city: string;
    keyword: string;
    guests: number;
    range: any; 
};
