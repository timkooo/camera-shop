import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectParameters = (state: RootState) => state[NameSpace.Application].parameters;
export const selectSorting = (state: RootState) => state[NameSpace.Application].sorting;
