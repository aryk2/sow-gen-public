import React, {Component, useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import useForm from 'react-hook-form';
import NavBar from "./NavBar";
import Grid from "@material-ui/core/Grid";
import start_build from "../helpers/sow_builder";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import {Typography} from "@material-ui/core";
import getCopperInfo from "../helpers/copper";

const customStyles = {
    control: base => ({
        ...base,
        height: 50,
        minHeight: 50
    })
};

const Form  =  () => {
    const [formState, setFormState] = useState(null);
    const [template, setTemplate] = useState(0);
    const [copperError, setCopperError] = useState(null);
    const [ready, setReady] = useState(false);
    const {register, unregister, handleSubmit, errors, setValue} = useForm();

    useEffect(() => {
        register({name: "template"});
        return () => {
            unregister('template');
        }
    }, []);


    const onSubmit = (data) => {
        setFormState(data);
    };

    useEffect( () => {
        submit();


    }, [formState]);

    async function wrapStart() {
        return new Promise((resolve, reject) => {
            let return_promise = start_build(formState);
            resolve(return_promise);
        });
    }

    async function submit() {
        let return_link = {"docsLink": '', "sheetsLink": ''};
        if(formState && formState.customer) {
            let resp = await checkCompany();
            if (resp !== "Customer not found in Copper" || (formState.customer_address && formState.customer_website)) {
                return_link = await wrapStart();
                let sheetsLink, docsLink = '';
                if (return_link && return_link.docsLink) {
                    docsLink = await return_link.docsLink;
                    setReady(true);
                }
                if (return_link && return_link.sheetsLink) {
                    sheetsLink = await return_link.sheetsLink;
                }
                console.log(docsLink);
                console.log(sheetsLink);
            }
        }
    }

    const DriveButton = () => {
        if(ready === true) {
            return (
                //this button becomes clickable when the SOW has been created, it opens a link to the SOW folder
                <Button variant="contained" style={{margin: 20}} href={"https://drive.google.com/drive/u/0/folders/1i2dtbIUX-NonzrNrnDMqSBbuhvdMpGJP"}>
                    View SOW in Drive
                </Button>
            )
        }
        else {
            return (
                //this button is disabled before the SOW has been created
                <Button variant="contained" style={{margin: 20}} disabled>
                    View SOW in Drive
                </Button>
            )
        }
    };

    async function checkCompany() {
        let resp = await getCopperInfo(formState.customer, "checkName");
        if(resp === false) {
            setCopperError("Customer not found in Copper");
            return new Promise((resolve, reject) => {
                resolve("Customer not found in Copper");
            })
        }

    }

        return (
            <Grid>
                <NavBar/>
                <Paper style={{padding:40, }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name={'name'}
                                        error={!!errors.name}
                                        helperText={(errors.name) ? 'Name is required' : null}
                                        inputRef={register({required: true})}
                                        label="SOW Author"
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                <Grid container justify={'flex-start'}>
                                    <Button
                                        size="medium"
                                        className="g-signin2"
                                        data-onsuccess="onSignIn"
                                        fullWidth
                                    >
                                    </Button>
                                    <Typography align={"center"} variant={"body2"}>Verify you are signed into an IGNW google account</Typography>
                                </Grid>
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name={'customer'}
                                        error={!!errors.customer}
                                        helperText={(errors.customer) ? 'Customer is required' : null}
                                        inputRef={register({required: true})}
                                        label="Customer"
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name={'customer_email'}
                                        inputRef={register()}
                                        label="Customer Email"
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Typography>{copperError}</Typography>
                            {((copperError) ?

                                    <div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    name={'customer_address'}
                                                    error={!!errors.customer_address}
                                                    helperText={(errors.customer_address) ? 'Customer address is required' : null}
                                                    inputRef={register({required: true})}
                                                    label="Customer Address"
                                                    margin="normal"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Grid container justify={'flex-start'}>
                                                    <TextField
                                                        name={'customer_website'}
                                                        error={!!errors.customer_website}
                                                        helperText={(errors.customer_website) ? 'Customer website is required' : null}
                                                        inputRef={register({required: true})}
                                                        label="Customer Website"
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    :
                                    null
                            )}
                        </div>
                        <div>
                            <TextField
                                name={'about_customer'}
                                inputRef={register()}
                                label="Customer Background"
                                multiline
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                name={'project_background'}
                                inputRef={register()}
                                label="Project Background"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                name={'engagement'}
                                inputRef={register()}
                                label="Project Engagement"
                                multiline
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                name={'scope_description'}
                                inputRef={register()}
                                label="Scope Summary*"
                                multiline
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                name={'phase_one'}
                                inputRef={register()}
                                label="Project Phase One Description*"
                                multiline
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name={'project_title'}
                                        inputRef={register()}
                                        label="Project Title"
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl
                                        fullWidth>
                                        <InputLabel>Template</InputLabel>
                                        <Select
                                            name={'template'}
                                            value={template}
                                            onChange={(evt) => {
                                                setValue('template', evt.target.value);
                                                setTemplate(evt.target.value)
                                            }}
                                            labelWidth={500}
                                            styles={customStyles}
                                            fullWidth={true}
                                        >
                                            <MenuItem value="tandm_sow_template">SOW - T&M</MenuItem>
                                            <MenuItem value="fixed_sow_template">SOW - Fixed</MenuItem>
                                            <MenuItem value="aci_supercharger_dsi">aci_supercharger_dsi</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>

                        <Grid item xs={12}>
                            <Grid container justify="center" >

                                <Grid key='0' item>
                                    <Grid>
                                        <Button variant="contained" type={"submit"} style={{margin:20}}>
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid key='1' item>
                                    <Grid>
                                        <DriveButton/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
    )
};




export default Form

