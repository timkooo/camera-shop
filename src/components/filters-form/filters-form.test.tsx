import { configureMockStore } from '@jedmao/redux-mock-store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { FiltersForm } from './filters-form';
import userEvent from '@testing-library/user-event';
import { NameSpace } from '../../const';
import { makeFakePromo } from '../../utils/mocks';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe('Component: FiltersForm', () => {
  it('should render correctly', async () => {
    const store = mockStore({
      [NameSpace.Application]: {
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
        promo: makeFakePromo(),
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <FiltersForm />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', {name: 'Видеокамера'});

    const actions = store.getActions().map(({type}) => type as string);

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    expect(actions).toEqual([
      'APPLICATION/updateFilters',
      'APPLICATION/updatePrice',
      'APPLICATION/loadMinMaxPrice/pending',
    ]);
  });
});
