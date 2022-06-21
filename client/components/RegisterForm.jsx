import { FacebookRounded, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, TextField, Input, InputLabel, InputAdornment, IconButton, Box, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import DataService from "../services/DataService";

const RegisterForm = () => {
    const [register, setRegister] = useState({
        email: '',
        username: '',
        password: ''
    });

    const [message, setMessage] = useState({
        message: '',
        colour: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setRegister(prevInput => {
            return { ...prevInput, [name]: value };
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUserSubmit = async (event) => {
        DataService.registerUser(register).then(res => {
            setMessage({
                message: res.data.message,
                colour: 'success'
            });
        }).catch(err => {
            setMessage({
                message: err.response.data,
                colour: 'error'
            });
        });
        setRegister({
            email: '',
            username: '',
            password: ''
        });
    };

    return (
        <Box sx={{ width: '40%', m: 5, p: 2, display: 'grid', textAlign: 'center', boxShadow: 2 }}>
            {message.message !== '' && <Alert severity={message.colour}>{message.message}</Alert>}
            <h2>Create your free account</h2>
            <FormControl sx={{ m: 1, }} variant="standard">
                <TextField label="Email" variant="standard" name="email" value={register.email} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ m: 1, }} variant="standard">
                <TextField label="Username" variant="standard" name="username" value={register.username} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ m: 1, }} variant="standard">
                <InputLabel htmlFor="register-password">Password</InputLabel>
                <Input
                    id="register-password"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={register.password}
                    onChange={handleChange}
                />
            </FormControl>
            <Button variant="contained" sx={{ m: 1 }} color="success" onClick={handleUserSubmit}>Register</Button>
            <Button variant="contained" sx={{ m: 1 }} color="primary" startIcon={<Google />}>Register with Google</Button>
            <Button variant="contained" sx={{
                m: 1,
                backgroundColor: '#4267B2'
            }} startIcon={<FacebookRounded />}>Register with Facebook</Button>

        </Box>
    )
}

export default RegisterForm;