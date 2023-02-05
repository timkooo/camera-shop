import { createAction } from '@reduxjs/toolkit';
import {AppRoutes, NameSpace} from '../const';

export const redirectToRoute = createAction<AppRoutes>(`${NameSpace.Application}/redirectToRoute`);
