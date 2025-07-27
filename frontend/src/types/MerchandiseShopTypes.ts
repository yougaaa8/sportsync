export interface Image {
    alt_text: string,
    created_at: string,
    id: number,
    image: string
    image_url: string
}

export interface ProductSummary {
    available: boolean,
    cca_name: string,
    first_image: string,
    id: number,
    image_count: number,
    name: string,
    price: string
}

export interface ProductDetail {
    available: boolean,
    buy_link: string,
    cca: number,
    cca_name: string,
    created_at: string,
    description: string,
    id: number,
    image_count: number,
    images: Image[],
    name: string,
    price: string
}

export interface WishlistItem {
    added_at: string,
    id: number,
    product: ProductSummary
}

export interface Wishlist {
    id: number,
    item_count: number,
    items: WishlistItem[]
}