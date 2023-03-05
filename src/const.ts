export const REVIEWS_TO_SHOW = 3;
export const PRODUCTS_PER_PAGE = 9;
export const SEARCH_RESULTS_TO_SHOW = 4;
export const DEFAULT_PAGE_PARAMS = {
  _start : '0',
  _end : PRODUCTS_PER_PAGE.toString(),
};
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;
export const ERROR_SHOW_TIME = 5000;
export const WRONG_DATA_CODE_ERROR = 400;
export const DEFAULT_DISCOUNT = 0;

export enum AppRoutes {
  Main = '/',
  Product = '/product',
  Catalog = '/catalog',
  Basket = '/basket',
  ErrorPage = '/error',
}

export enum APIRoute {
  Cameras = '/cameras',
  Reviews = '/reviews',
  Promo = '/promo',
  Coupons = '/coupons',
  Orders = '/orders',
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

export enum UrlParams {
  PageStart = '_start',
  PageEnd = '_end',
  Sorting = '_sort',
  Order = '_order',
}
