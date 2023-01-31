import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

// export const selectCurrentCity = (state: RootState) => state[NameSpace.Application].currentCity;
// export const selectCurrentSorting = (state: RootState) => state[NameSpace.Application].currentSorting;

export const selectCurrentPage = (state: RootState) => state[NameSpace.Application].currentPage;
export const selectParameters = (state: RootState) => state[NameSpace.Application].parameters;
export const selectSorting = (state: RootState) => state[NameSpace.Application].sorting;
