import { FacebookRounded, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, TextField, Input, InputLabel, InputAdornment, IconButton, Box, Button, Alert, CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DataService from "../services/DataService";

const LoginForm = () => {
    const [login, setLogin] = useState({
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

        setLogin(prevInput => {
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
        DataService.loginUser(login).then(res => {
            console.log({ response: res });
            setMessage({
                message: res.message,
                colour: 'success'
            });
            setLoading(false);
            router.reload();
        }).catch(err => {
            setMessage({
                message: err.response.data.message,
                colour: 'error'
            });
            setLoading(false);
        });
        setLogin({
            email: '',
            username: '',
            password: ''
        });
    };

    const handleGoogleSignIn = async () => {
        router.push('https://blog-boss-api.onrender.com/user/auth/google');
    };

    const handleFacebookSignIn = async () => {
        router.push('https://blog-boss-api.onrender.com/user/auth/facebook');
    };

    return (
        <Box sx={{ width: { xs: '95%', md: '40%' }, m: { xs: 1, md: 5 }, p: 2, display: 'grid', textAlign: 'center', boxShadow: 2 }}>
            {message.message !== '' && <Alert severity={message.colour}>{message.message}</Alert>}
            <h2>Login to your account</h2>
            {
                loading ?
                    <Stack alignItems="center">
                        <CircularProgress />
                    </Stack>
                    :
                    <>
                        <FormControl sx={{ m: 1, }} variant="standard">
                            <TextField label="Username" variant="standard" name="username" value={login.username} onChange={handleChange} />
                        </FormControl>
                        <FormControl sx={{ m: 1, }} variant="standard">
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input
                                id="login-password"
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
                                value={login.password}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <Button variant="contained" sx={{ m: 1 }} color="success" onClick={handleUserSubmit}>Login</Button>
                        <Button variant="contained" sx={{ m: 1 }} color="primary" onClick={handleGoogleSignIn} startIcon={<Google />}>Login with Google</Button>
                        <Button variant="contained" sx={{
                            m: 1,
                            backgroundColor: '#4267B2'
                        }} onClick={handleFacebookSignIn} startIcon={<FacebookRounded />}>Login with Facebook</Button>

                    </>
            }

        </Box>
    )
}

export default LoginForm;