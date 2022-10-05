import { FacebookRounded, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, TextField, Input, InputLabel, InputAdornment, IconButton, Box, Button, Alert, CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";
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
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
        setLoading(true);
        DataService.registerUser(register).then(res => {
            setMessage({
                message: res.data.message,
                colour: 'success'
            });
            setLoading(false);
        }).catch(err => {
            setMessage({
                message: err.response.data,
                colour: 'error'
            });
            setLoading(false);
        });
        setRegister({
            email: '',
            username: '',
            password: ''
        });
    };

    const handleGoogleSignUp = async () => {
        router.push('https://blog-boss-api.onrender.com/user/auth/google');
    };

    const handleFacebookSignUp = async () => {
        router.push('https://blog-boss-api.onrender.com/user/auth/facebook');
    };

    return (
        <Box sx={{ width: { xs: '95%', md: '40%' }, m: { xs: 1, md: 5 }, p: 2, display: 'grid', textAlign: 'center', boxShadow: 2 }}>
            {message.message !== '' && <Alert severity={message.colour}>{message.message}</Alert>}
            <h2>Create your free account</h2>
            {
                loading ?
                    <Stack alignItems="center">
                        <CircularProgress />
                    </Stack>
                    :
                    <>
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
                        <Button variant="contained" sx={{ m: 1 }} color="primary" onClick={handleGoogleSignUp} startIcon={<Google />}>Register with Google</Button>
                        <Button variant="contained" sx={{
                            m: 1,
                            backgroundColor: '#4267B2'
                        }} onClick={handleFacebookSignUp} startIcon={<FacebookRounded />}>Register with Facebook</Button>

                    </>
            }
        </Box>
    );
};

export default RegisterForm;