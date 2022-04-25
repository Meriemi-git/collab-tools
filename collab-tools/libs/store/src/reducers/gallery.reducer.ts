import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Image } from '@collab-tools/datamodel';
import * as actions from '../actions/gallery.action';
import { GalleryState } from '../states/gallery.state';

export const adapter: EntityAdapter<Image> = createEntityAdapter<Image>({
  sortComparer: sortByDate,
  selectId: (image: Image) => image._id,
});

export function sortByDate(a: Image, b: Image): number {
  return a.uploadedAt < b.uploadedAt ? -1 : 1;
}

export const initialstate: GalleryState = adapter.getInitialState({
  draggedImage: null,
  draggedImageLink: null,
  error: null,
});

const galleryReducer = createReducer(
  initialstate,
  on(actions.GetGalleryImages, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.GetGalleryImagesSuccess, (state, { images }) => {
    return adapter.addMany(images, { ...state, images: images, error: null });
  }),
  on(actions.GetGalleryImagesError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.UploadGalleryImage, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.UploadGalleryImageSuccess, (state, { image }) => {
    return adapter.addOne(image, {
      ...state,
      error: null,
    });
  }),
  on(actions.UploadGalleryImageError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.DragImage, (state, { image }) => ({
    ...state,
    draggedImage: image,
  })),
  on(actions.DragImageSuccess, (state) => ({
    ...state,
    draggedImage: null,
  })),
  on(actions.DragImageLink, (state, { link }) => ({
    ...state,
    draggedImageLink: link,
  })),
  on(actions.DragImageLinkSuccess, (state) => ({
    ...state,
    draggedImageLink: null,
  })),
  on(actions.DeleteGalleryImageSuccess, (state, { image }) => {
    return adapter.removeOne(image._id, {
      ...state,
      error: null,
    });
  })
);

export function reducer(state: GalleryState | undefined, action: Action) {
  return galleryReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

export const selectAllImages = selectAll;
