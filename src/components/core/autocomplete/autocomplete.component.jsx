import React from 'react';
import Autosuggest from 'react-autosuggest';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import CircularProgress from './circular-progress.component';

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            position: 'relative',
        },
        input: ({ error }) => ({
            padding: theme.spacing(2),
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            border: `1px solid ${error ? theme.palette.error.main : theme.palette.common.black}`,
            backgroundColor: 'inherit',
            borderRadius: '4px',
            '&:hover': {
                border: `1px solid ${
                    error ? theme.palette.error.main : theme.palette.common.black
                }`,
            },
        }),
        inputFocused: ({ error }) => ({
            outline: 'none',
            border: `2px solid  ${error ? theme.palette.error.main : theme.palette.primary.main}`,
        }),
        inputOpen: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        suggestionsContainer: {
            display: 'none',
        },

        suggestionsContainerOpen: {
            display: 'block',
            position: 'absolute',
            top: '49px',
            width: '240px',
            border: `1px solid  ${theme.palette.primary.main}`,
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            backgroundColor: theme.palette.primary.contrastText,
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            zIndex: 3,
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none',
            maxHeight: '200px',
            overflow: 'scroll',
        },

        suggestion: {
            cursor: 'pointer',
            padding: theme.spacing(1),
        },
        suggestionHighlighted: {
            backgroundColor: '#ddd',
        },
        label: {},
        loadingContainer: {
            height: '30px',
        },
    })
);

const Autosuggestion = ({
    getSuggestions,
    getSuggestionValue,
    renderSuggestion,
    inputProps,
    value,
    label,
    onChange,
    isLoading = false,
    error,
    helperText,
    name,
}) => {
    const [newSuggestions, setNewSuggestions] = React.useState([]);
    const classes = useStyles({ error });
    const { t } = useTranslation();

    const onSuggestionsFetchRequested = async ({ value: val }) => {
        const suggestions = await getSuggestions(val);
        setNewSuggestions(suggestions);
    };

    const onSuggestionsClearRequested = () => {
        setNewSuggestions([]);
    };

    const render = suggestion => {
        if (isLoading) {
            return (
                <Grid
                    className={classes.loadingContainer}
                    container
                    justify="center"
                    alignItems="center"
                >
                    <CircularProgress size={20} />
                </Grid>
            );
        }
        return renderSuggestion(suggestion);
    };

    const handleChange = (event, { newValue }) => {
        if (onChange)
            onChange({
                target: {
                    value: newValue,
                    name,
                },
            });
    };

    return (
        <FormControl variant="outlined" error={error} margin="normal">
            {label && (
                <InputLabel className={classes.label} shrink={true} id={`id_${label}`}>
                    {t(label)}
                </InputLabel>
            )}
            <Autosuggest
                suggestions={isLoading ? [{}] : newSuggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={render}
                inputProps={{ ...inputProps, value, onChange: handleChange }}
                theme={classes}
            />
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
};

export default Autosuggestion;
