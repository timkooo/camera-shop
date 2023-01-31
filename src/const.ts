export const REVIEWS_TO_SHOW = 3

export enum AppRoutes {
  Main = '/',
  Product = '/product',
  Catalog = '/catalog',
  Basket = '/basket',
}

export enum APIRoute {
  Cameras = '/cameras',
  Reviews = '/reviews',
}

export enum NameSpace {
  Application = 'APPLICATION',
  Cameras = 'CAMERAS',
  Reviews = 'REVIEWS',
  Basket = 'BASKET',
}

const filterNames: Record<string, string> = {
  'photocamera': 'Фотоаппарат',
  'videocamera': 'Видеокамера'
}

const filterNamesToTypes: Record<string, string>  = {
  [filterNames.photocamera]: 'category',
  [filterNames.videocamera]: 'category'
}

const sortingNamesToCategories: Record<string, string> = {
  'sort': '_sort',
  'sort-icon': '_order'
}

export const getCategoryName = (name: string) => filterNamesToTypes[filterNames[name]];
export const getFilterName = (name: string) => filterNames[name];
export const getSortingCategory = (name: string) => sortingNamesToCategories[name];