import { useState, useRef, useCallback, useEffect } from 'react';
import { hasNonEmptyValue, setNestedObjectValues, setIn, getIn } from './helper';

export function useForm(props) {
    const [renderCount, setRenderCount] = useState(1);
    const rerender = () => {
        setRenderCount(renderCount + 1);
    };
    const state = useRef({
        values: props.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
    });

    useEffect(() => {
        if (!state.current.values && props.initialValues) {
            state.current.values = props.initialValues;
            rerender();
        }
    });

    const isDirty = useCallback(() => {
        const dirty = hasNonEmptyValue(state.current.touched);
        return dirty;
    }, [state]);

    const isSubmitting = useCallback(() => {
        return state.current.isSubmitting;
    }, [state]);

    const isValidating = useCallback(() => {
        return state.current.isValidating;
    }, [state]);

    const resetForm = () => {
        state.current.values = props.initialValues;
        state.current.touched = {};
        state.current.errors = {};
        rerender();
    };

    const submitForm = async () => {
        if (!state.current.values) return false;
        if (state.current.isSubmitting || state.current.isValidating) return false;

        state.current.touched = setNestedObjectValues(state.current.values, true);
        state.current.errors = {};
        state.current.isValidating = true;
        state.current.isSubmitting = true;
        state.current.submitCount = state.current.submitCount + 1;

        if (props.validate) {
            const errors = await props.validate(state.current.values);
            const hasError = hasNonEmptyValue(errors);
            if (hasError) {
                state.current.isSubmitting = false;
                state.current.isValidating = false;
                state.current.errors = errors;
                rerender();
                return false;
            }
        }

        const result = await props.submit(state.current.values, form);
        if (result.errors) {
            const hasError = hasNonEmptyValue(result.errors);
            if (hasError) {
                state.current.isValidating = false;
                state.current.isSubmitting = false;
                state.current.errors = result.errors;
                rerender();
                return false;
            }
        }
        if (result.valuesFromServer) {
            state.current.values = result.valuesFromServer;
        }
        state.current.touched = {};
        state.current.isValidating = false;
        state.current.isSubmitting = false;
        rerender();
        return true;
    };

    let rerenderDepth = 0;
    const setFieldValue = async (path, value) => {
        const newValues = setIn(state.current.values, path, value);
        if (newValues === state.current.values) {
            return;
        }
        const previousValues = state.current.values;
        state.current.values = newValues;
        state.current.touched = setIn(
            state.current.touched,
            path,
            value !== getIn(props.initialValues, path)
        );
        if (props.onChange) {
            const previousValue = getIn(previousValues, path);
            rerenderDepth++;
            try {
                await props.onChange(path, previousValue, value);
            } catch (err) {
            } finally {
                rerenderDepth--;
            }
        }
        if (rerenderDepth === 0) {
            rerender();
        }
    };

    const removeFromArray = (pathToArray, index) => {
        const array = getIn(state.current.values, pathToArray);
        if (Array.isArray(array)) {
            if (index < array.length) {
                array.splice(index, 1);
                const newValues = setIn(state.current.values, pathToArray, array);
                state.current.values = newValues;
                state.current.touched = setIn(
                    state.current.touched,
                    `${pathToArray}[${index}]`,
                    true
                );
                rerender();
            }
        }
    };

    const changeHandler = e => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFieldValue(name, checked);
        } else {
            setFieldValue(name, value);
        }
    };

    const getFieldProps = path => {
        const value = getIn(state.current.values, path);

        const errorNode = getIn(state.current.errors, path);
        const touched = getIn(state.current.touched, path);
        const error = !!errorNode && !!touched;
        const helperText = error && errorNode;

        return {
            onChange: changeHandler,
            name: path,
            id: path,
            value,
            error,
            helperText,
        };
    };

    const getHelperText = path => {
        return getIn(state.current.errors, path);
    };

    const form = {
        getFieldProps,
        get values() {
            return state.current.values;
        },
        isDirty,
        isSubmitting,
        isValidating,
        submitForm,
        resetForm,
        setFieldValue,
        removeFromArray,
        getHelperText,
    };

    return form;
}
