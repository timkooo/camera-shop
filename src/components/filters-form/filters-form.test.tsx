import { configureMockStore } from '@jedmao/redux-mock-store';
import { fireEvent, render, screen } from '@testing-library/react';
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
          minPrice: 3000,
          maxPrice: 9000,
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

    expect(screen.getByPlaceholderText('от')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('до')).toBeInTheDocument();

    const priceFrom = screen.getAllByRole('spinbutton');

    expect(priceFrom[0]).toHaveValue(3000);
    expect(priceFrom[1]).toHaveValue(9000);

    await userEvent.clear(priceFrom[0]);
    await userEvent.clear(priceFrom[1]);

    expect(priceFrom[0]).toHaveValue(null);
    expect(priceFrom[0]).toHaveValue(null);

    await userEvent.type(priceFrom[0], '4000');
    fireEvent.blur(priceFrom[0]);
    await userEvent.type(priceFrom[1], '100000');
    fireEvent.blur(priceFrom[1]);

    expect(priceFrom[0]).toHaveValue(4000);
    expect(priceFrom[1]).toHaveValue(9000);

    await userEvent.clear(priceFrom[0]);
    await userEvent.clear(priceFrom[1]);

    await userEvent.type(priceFrom[0], '4000');
    fireEvent.blur(priceFrom[0]);
    await userEvent.type(priceFrom[1], '1000');
    fireEvent.blur(priceFrom[1]);

    expect(priceFrom[0]).toHaveValue(4000);
    expect(priceFrom[1]).toHaveValue(4000);
  });
});
