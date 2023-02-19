export const REVIEWS_TO_SHOW = 3;
export const PRODUCTS_PER_PAGE = 9;
export const SEARCH_RESULTS_TO_SHOW = 4;

export enum AppRoutes {
  Main = '/',
  Product = '/product',
  Catalog = '/catalog',
  Basket = '/basket',
}

export enum APIRoute {
  Cameras = '/cameras',
  Reviews = '/reviews',
  Promo = '/promo',
}

export enum NameSpace {
  Application = 'APPLICATION',
  Cameras = 'CAMERAS',
  Reviews = 'REVIEWS',
  Basket = 'BASKET',
}

const filterNames: Record<string, string> = {
  'photocamera': 'Фотоаппарат',
  'videocamera': 'Видеокамера',
  'digital': 'Цифровая',
  'film': 'Плёночная',
  'snapshot': 'Моментальная',
  'collection': 'Коллекционная',
  'zero': 'Нулевой',
  'nonprofessional': 'Любительский',
  'professional': 'Профессиональный',
};

const filterNamesToTypes: Record<string, string> = {
  [filterNames.photocamera]: 'category',
  [filterNames.videocamera]: 'category',
  [filterNames.digital]: 'type',
  [filterNames.film]: 'type',
  [filterNames.snapshot]: 'type',
  [filterNames.collection]: 'type',
  [filterNames.zero]: 'level',
  [filterNames.nonprofessional]: 'level',
  [filterNames.professional]: 'level',
};

const sortingNamesToCategories: Record<string, string> = {
  'sort': '_sort',
  'sort-icon': '_order'
};

export const getCategoryName = (name: string) => filterNamesToTypes[filterNames[name]];
export const getFilterName = (name: string) => filterNames[name];
export const getSortingCategory = (name: string) => sortingNamesToCategories[name];
export const getKeyByValue = (value: string) => (Object.keys(filterNames)).find((key) => filterNames[key] === value);

export enum SortingTypes {
  PriceUp = 'price_gte',
  PriceDown = 'price_lte'
}
