import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SimpleSelect from "./Selectors";


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
}));

export default function BasicTextFields() {
    const classes = useStyles();

    return (
        <form className={classes.container} noValidate autoComplete="off">

            <div>
                <TextField
                    id="filled-basic"
                    className={classes.textField}
                    label="Name"
                    margin="normal"
                    variant="filled"
                />
                <TextField
                    id="filled-basic"
                    className={classes.textField}
                    label="Customer"
                    margin="normal"
                    variant="filled"
                />
            </div>
            <div>
                <SimpleSelect/>
            </div>

        </form>
    );
}