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

export type RoomItem = {
    id: number;
    name: string;
    city: string;
    type: string;
    features: string[];
    price: number;
    image: string;
    label?: string;
    labelColor?: string;
};

export type SearchState = {
    city: string;
    keyword: string;
    guests: number;
    range: any; 
};
