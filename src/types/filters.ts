import { Camera } from './camera';

export type Category = keyof Camera;

type CreateFiltersType<Type> = {
  [Property in keyof Type]?: Type[Property][];
};

export type Filters = CreateFiltersType<Camera>;
