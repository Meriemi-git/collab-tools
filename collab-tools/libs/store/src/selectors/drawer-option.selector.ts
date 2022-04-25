import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DrawerOptionName } from '@collab-tools/datamodel';
import { selectAll } from '../reducers/drawer-option.reducer';
import { DrawerOptionState } from '../states/drawer-option.state';

const drawingOptionFeature =
  createFeatureSelector<DrawerOptionState>('DrawerOptionState');

export const getAllOptions = createSelector(drawingOptionFeature, selectAll);

export const getFontSize = createSelector(getAllOptions, (options) => {
  return options.find((option) => option.name === DrawerOptionName.FONT_SIZE);
});

export const getOptionByName = (name: string) =>
  createSelector(getAllOptions, (options) => {
    return options.find((n) => n.name === name);
  });
