import { makeFakePromo } from '../../utils/mocks';
import { loadPromo } from '../api-actions';
import { applicationSlice, InitialState, updateFilters, updateParameters, updatePrice, updateSorting } from './application.slice';

const promo = makeFakePromo();

describe('Reducer: applicationSlice', () => {

  let state : InitialState;

  beforeEach(() => {
    state = {
      price: {
        'price_gte': 6000,
        'price_lte': 8000,
      },
      filters: {},
      sorting: {
        _sort: 'price',
        _order: 'asc',
      },
      parameters: {},
      promo: null,
      isPromoLoading: false,
    };
  });

  it('should update filters', () => {
    expect(
      applicationSlice.reducer(state, updateFilters({
        type : ['digital', 'film'],
        level : ['zero', 'professional']
      }))
    ).toEqual({
      price: {
        'price_gte': 6000,
        'price_lte': 8000,
      },
      filters: {
        type : ['digital', 'film'],
        level : ['zero', 'professional']
      },
      sorting: {
        _sort: 'price',
        _order: 'asc',
      },
      parameters: {},
      promo: null,
      isPromoLoading: false,
    });
  });

  it('should update price filter', () => {
    expect(
      applicationSlice.reducer(state, updatePrice({
        'price_gte': 9000,
        'price_lte': 30000,
      }))
    ).toEqual({
      price: {
        'price_gte': 9000,
        'price_lte': 30000,
      },
      filters: {},
      sorting: {
        _sort: 'price',
        _order: 'asc',
      },
      parameters: {},
      promo: null,
      isPromoLoading: false,
    });
  });

  it('should update sorting', () => {
    expect(
      applicationSlice.reducer(state, updateSorting({
        _sort: 'rating',
        _order: 'desc',
      }))
    ).toEqual({
      price: {
        'price_gte': 6000,
        'price_lte': 8000,
      },
      filters: {},
      sorting: {
        _sort: 'rating',
        _order: 'desc',
      },
      parameters: {},
      promo: null,
      isPromoLoading: false,
    });
  });

  it('should update parameters', () => {
    expect(
      applicationSlice.reducer(state, updateParameters({
        '_start': '0',
        '_end': '10',
      }))
    ).toEqual({
      price: {
        'price_gte': 6000,
        'price_lte': 8000,
      },
      filters: {},
      sorting: {
        _sort: 'price',
        _order: 'asc',
      },
      parameters: {
        '_start': '0',
        '_end': '10',
      },
      promo: null,
      isPromoLoading: false,
    });
  });

  it('should update promo by load promo', () => {
    expect(
      applicationSlice.reducer(state, {
        type: loadPromo.fulfilled.type,
        payload: promo,
      })
    ).toEqual({
      price: {
        'price_gte': 6000,
        'price_lte': 8000,
      },
      filters: {},
      sorting: {
        _sort: 'price',
        _order: 'asc',
      },
      parameters: {},
      promo: promo,
      isPromoLoading: false,
    });
  });

});
