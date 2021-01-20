import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import BaseCircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            display: 'flex',
            right: '1%',
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    })
);

const CircularProgress = ({ size }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BaseCircularProgress size={size} color="primary" />
        </div>
    );
};

export default CircularProgress;
