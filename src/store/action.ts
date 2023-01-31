import { createAction } from '@reduxjs/toolkit';
import {AppRoutes, NameSpace} from '../const';
// import { Place } from '../types/place';

export const redirectToRoute = createAction<AppRoutes>(`${NameSpace.Application}/redirectToRoute`);

// export const updatePlacesAction = createAction<Place>(`${NameSpace.Places}/updatePlacesAction`);
