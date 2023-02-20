import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCameras } from '../../utils/mocks';
import { Search } from './search';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe('Component: Search', () => {
  it('should render correctly', async () => {
    const cameras = makeFakeCameras();
    const store = mockStore({
      [NameSpace.Cameras]: {
        searchResults: cameras,
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Search />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Поиск по сайту')).toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox'), 'How much is the fish?');

    expect(screen.getByDisplayValue('How much is the fish?')).toBeInTheDocument();
  });
});
