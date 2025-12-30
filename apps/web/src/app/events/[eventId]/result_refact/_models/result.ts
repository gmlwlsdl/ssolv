export interface Surveys {
  preferredCuisineList: string[];
  preferredFlavorList: string[];
  avoidIngredientList: string[];
  avoidMenuList: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  distance: string;
  status: '영업 중' | '영업 종료' | '준비 중';
  lastOrder?: string;
  reason: string[];
  image: string;
  rating: number;
  category: string;
  priceRange: string;
}
