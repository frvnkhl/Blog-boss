import { FacebookRounded, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, TextField, Input, InputLabel, InputAdornment, IconButton, Box, Button, Alert } from "@mui/material";
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
        DataService.loginUser(login).then(res => {
            console.log({response: res});
            setMessage({
                message: res.data,
                colour: 'success'
            });
            router.reload();
        }).catch(err => {
            console.log({error: err});
            setMessage({
                message: err.data,
                colour: 'error'
            });
        });
        setLogin({
            email: '',
            username: '',
            password: ''
        });
    };

    return (
        <Box sx={{ width: '40%', m: 5, p: 2, display: 'grid', textAlign: 'center', boxShadow: 2 }}>
            {message.message !== '' && <Alert severity={message.colour}>{message.message}</Alert>}
            <h2>Login to your account</h2>
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
            <Button variant="contained" sx={{ m: 1 }} color="primary" startIcon={<Google />}>Login with Google</Button>
            <Button variant="contained" sx={{
                m: 1,
                backgroundColor: '#4267B2'
            }} startIcon={<FacebookRounded />}>Login with Facebook</Button>

        </Box>
    )
}

export default LoginForm;