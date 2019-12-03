import React from 'react';
import './App.css';
import Form from "./components/Form";
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid";







const App = () =>  {
    return (
        <div className={"App1"}>




        <Grid
            container
            alignContent = "center"
            justify = "center"
        >
                <Box>
                    <Form/>
                </Box>
        </Grid>
        </div>
    )

};





export default App;


