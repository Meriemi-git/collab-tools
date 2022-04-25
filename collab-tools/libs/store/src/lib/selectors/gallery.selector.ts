import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/gallery.reducer';
import { GalleryState } from '../states/gallery.state';

const galleryFeature = createFeatureSelector<GalleryState>('GalleryState');

export const getDraggedImage = createSelector(
  galleryFeature,
  (state: GalleryState) => state.draggedImage
);

export const getDraggedImageLink = createSelector(
  galleryFeature,
  (state: GalleryState) => state.draggedImageLink
);

export const getGalleryImages = createSelector(galleryFeature, selectAll);
