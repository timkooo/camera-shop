import { Camera } from './camera';

export type Category = keyof Camera;

type CreateMutable<Type> = {
  [Property in keyof Type]: string[];
};

type CreateFilters2Type<Type> = {
  [Property in keyof Type]?: Type[Property][];
};

export type Filters = CreateMutable<Camera>;

export type Filters2 = CreateFilters2Type<Camera>;
