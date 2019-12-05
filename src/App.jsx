import React from 'react';
import './App.css';
import Form from "./components/Form";

import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";



const App = () => {
    let isLoggedIn = true;//this.state.isLoggedIn;
    return (
    <div>
        {isLoggedIn ? (
            <Grid container alignContent = "center" justify = "center">
                <Box>
                    <Form/>
                </Box>
            </Grid>
        ) : (
            <Typography>Not Logged In</Typography>
        )}
    </div>
    )

}
/*

{(loggedIn === true) : (
                <Grid
                container
                alignContent = "center"
                justify = "center"
                >
                <Box>
                <Form/>
                </Box>
                </Grid>
                ) : (
                <div>No one here</div>
                )}
 */



export default App;


