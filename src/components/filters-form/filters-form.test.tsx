import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { FiltersForm } from './filters-form';
import userEvent from '@testing-library/user-event';

const mockStore = configureMockStore();

describe('Component: FiltersForm', () => {
  it('should render correctly', async () => {
    const store = mockStore();

    render(
      <Provider store={store}>
        <FiltersForm />
      </Provider>
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
    ]);
  });
});
