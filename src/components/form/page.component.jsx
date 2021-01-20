import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Form from './form.component';

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            background: `linear-gradient(to bottom right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            padding: theme.spacing(2),
        },
    })
);

const LoginPage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid item xs={10} sm={10} md={4} lg={4}>
                <Paper classes={{ root: classes.container }}>
                    <Form />
                </Paper>
            </Grid>
        </div>
    );
};

export default LoginPage;
