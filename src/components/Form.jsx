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


const customStyles = {
    control: base => ({
        ...base,
        height: 50,
        minHeight: 50
    })
};



const Form  =  () => {
    const [formState, setFormState] = useState(null);
    const [service, setService] = useState(0);
    const [Var, setVar] = useState(0);
    const [quote, setQuote] = useState(0);
    const [about, setAbout] = useState(0);
    const [tnc, setTnc] = useState(0);
    const [returnLink, setReturnLink] = useState(0);
    const {register, unregister, handleSubmit, errors, setValue} = useForm();

    useEffect(() => {
        register({name: "service"});
        register({name: "Var"});
        register({name: "quote"});
        register({name: "about"});
        register({name: "tnc"});
        return () => {
            unregister('service');
            unregister('Var');
            unregister('quote');
            unregister('about');
            unregister('tnc');
        }
    }, []);


    const onSubmit = (data) => {
        setFormState(data);
    };

    useEffect( () => {
        let x = submit();


    }, [formState]);

    async function wrapStart() {
        return new Promise((resolve, reject) => {
            let return_promise = start_build(formState);
            resolve(return_promise);
        });
    }

    async function submit() {
        let return_link = 0;
        return_link = await wrapStart();
        //return_link = String(return_link);
        //window.open(return_link, "_blank");
        setReturnLink(return_link);
        console.log(return_link);


    };

    const DriveButton = () => {
        if(returnLink === 0) {
            return (
                <Button variant="contained" style={{margin: 20}} disabled>
                    View SoW in Drive
                </Button>
            )
        }
        else {
            return (
                <Button variant="contained" style={{margin: 20}} disabled>
                    View SoW in Drive
                </Button>
            )
        }
    };

        return (

            <Grid>
                <NavBar/>
            <Paper style={{padding:40, }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <TextField
                        name={'name'}
                        error={!!errors.name}
                        helperText={(errors.name) ? 'Name is required' : null}
                        inputRef={register({required: true})}
                        label="Name"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div>
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
                </div>
                <div style={{margin:20}}>
                    <FormControl
                    fullWidth>
                        <InputLabel>Service</InputLabel>
                    <Select
                        name={'service'}
                        value={service}
                        onChange={(evt) => {
                            setValue('service', evt.target.value);
                            setService(evt.target.value)
                        }}
                        labelWidth={500}
                        styles={customStyles}
                        fullWidth={true}
                    >
                        <MenuItem value={''}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="aci_supercharger_dsi">aci_supercharger_dsi</MenuItem>
                    </Select>
                    </FormControl>
                </div>
                <div style={{margin:20}}>
                    <FormControl
                    fullWidth>
                        <InputLabel>Var</InputLabel>
                        <Select
                            name={'Var'}
                            value={Var}
                            onChange={(evt) => {
                                setValue('Var', evt.target.value);
                                setVar(evt.target.value)
                            }}
                            labelWidth={500}
                            styles={customStyles}
                            fullWidth={true}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="CDW">CDW</MenuItem>
                            <MenuItem value="GDT">GDT</MenuItem>
                            <MenuItem value="Presidio">Presidio</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{margin:20}}>
                <FormControl
                    fullWidth>
                    <InputLabel>Type of Quote</InputLabel>
                    <Select
                        name={'quote'}
                        value={quote}
                        onChange={(evt) => {
                            setValue('quote', evt.target.value);
                            setQuote(evt.target.value)
                        }}
                        labelWidth={500}
                        styles={customStyles}
                        fullWidth={true}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="T&M">T&M</MenuItem>
                        <MenuItem value="Fixed Fee">Fixed Fee</MenuItem>
                        <MenuItem value="Mixed Fixed and Variable">Mixed Fixed and Variable</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <div style={{margin:20}}>
                    <FormControl
                        fullWidth>
                        <InputLabel>Include About IGNW</InputLabel>
                        <Select
                            name={'about'}
                            value={about}
                            onChange={(evt) => {
                                setValue('about', evt.target.value);
                                setAbout(evt.target.value)
                            }}
                            labelWidth={500}
                            styles={customStyles}
                            fullWidth={true}
                        >
                            <MenuItem value="Yes">
                                <em>Yes</em>
                            </MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{margin:20}}>
                    <FormControl
                        fullWidth>
                        <InputLabel>Include T&Cs</InputLabel>
                        <Select
                            name={'tnc'}
                            value={tnc}
                            onChange={(evt) => {
                                setValue('tnc', evt.target.value);
                                setTnc(evt.target.value)
                            }}
                            labelWidth={500}
                            styles={customStyles}
                            fullWidth={true}
                        >
                            <MenuItem value="MSA">MSA</MenuItem>
                            <MenuItem value="TnC">Standard T&Cs</MenuItem>
                        </Select>
                    </FormControl>
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
                <Typography align={"center"} variant={"body2"}>{returnLink}</Typography>
            </Paper>
            </Grid>
    )
};




export default Form

