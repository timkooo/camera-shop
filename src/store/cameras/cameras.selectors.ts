import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { RootState } from '../../types/store';
// import { SortingTypes, sortingToFunction } from '../../const';
// import {
//   selectCurrentCity,
//   selectCurrentSorting,
// } from '../application/application.selectors';

// const selectPlaces = (state: RootState) => state[NameSpace.Places].places;
// export const selectArePlacesLoaded = (state: RootState) =>
//   state[NameSpace.Places].arePlacesLoaded;

// export const selectCurrentPlaces = createSelector(
//   [selectPlaces, selectCurrentCity, selectCurrentSorting],
//   (placesAll, currentCity, currentSorting) => {
//     if (currentSorting === SortingTypes.Popular) {
//       return getPlacesByCity(currentCity, placesAll);
//     }
//     return getPlacesByCity(currentCity, placesAll).sort(
//       sortingToFunction[SortingTypes[currentSorting]]
//     );
//   }
// );


export const selectDoesCamerasLoading = (state: RootState) => state[NameSpace.Cameras].doesCamerasLoading;
export const selectCameras = (state: RootState) => state[NameSpace.Cameras].cameras;
export const selectCamerasAmount = (state: RootState) => state[NameSpace.Cameras].camerasAmount;
export const selectCameraById = (state: RootState) => state[NameSpace.Cameras].cameraById;
export const selectDoesCameraByIdLoading = (state: RootState) => state[NameSpace.Cameras].doesCameraByIdLoading;
export const selectSimilarCameras = (state: RootState) => state[NameSpace.Cameras].similarCameras;
export const selectDoesSimilarCamaerasLoading = (state: RootState) => state[NameSpace.Cameras].doesSimilarCamerasLoading;
// export const selectIsCurrentPlaceLoaded = (state: RootState) => state[NameSpace.Places].isCurrentPlaceLoaded;
// export const selectNearestPlaces = (state: RootState) => state[NameSpace.Places].nearestPlaces;
// export const selectAreNearestPlacesLoaded = (state: RootState) => state[NameSpace.Places].areNearestPlacesLoaded;
