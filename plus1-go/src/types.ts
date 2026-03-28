export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  deliveryFee: string;
  timeRange: string;
  rating: number;
  isTopRated?: boolean;
  isFavorite?: boolean;
}

export interface PickUpSpot {
  id: string;
  name: string;
  image: string;
  type: string;
  distance: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface BasketItem extends MenuItem {
  quantity: number;
}
