import { EntityState } from '@ngrx/entity';
import { DrawerOption } from '@collab-tools/datamodel';

export interface DrawerOptionState extends EntityState<DrawerOption> {
  selectedOption: DrawerOption;
}
