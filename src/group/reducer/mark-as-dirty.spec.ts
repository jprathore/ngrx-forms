import { MarkAsDirtyAction } from '../../actions';
import { cast, FormGroupState } from '../../state';
import { markAsDirtyReducer } from './mark-as-dirty';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE,
  INITIAL_STATE_FULL,
  setPropertiesRecursively,
} from './test-util';

describe(`form group ${markAsDirtyReducer.name}`, () => {
  const INITIAL_STATE_FULL_DIRTY = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]));

  it('should mark itself and all children recursively as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_DIRTY);
  });

  it('should not update state if all children are marked as dirty recursively', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL_DIRTY, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL_DIRTY);
  });

  it('should mark children as dirty if the group itself is already marked as dirty', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsDirtyReducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_DIRTY);
  });

  it('should mark control children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(true);
    expect(resultState.controls.inner.isPristine).toEqual(false);
  });

  it('should mark group children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isDirty).toEqual(true);
    expect(resultState.controls.inner3.isPristine).toEqual(false);
  });

  it('should mark array children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isDirty).toEqual(true);
    expect(resultState.controls.inner5.isPristine).toEqual(false);
  });

  it('should mark state as dirty if control child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if group child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if array child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });
});
