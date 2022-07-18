import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Modal, Box, Typography, FormControl, TextField, Button, InputAdornment, IconButton, Collapse, Alert } from "@mui/material";
import { useState } from "react";
import DataService from "../services/DataService";

const ChangePasswordForm = (props) => {
    const handleClose = () => props.setOpen(false);
    const [newPass, setNewPass] = useState({
        newPassword: '',
        newPasswordConfirm: '',
    });

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        newPasswordConfirm: false,
    });

    const [formProcessed, setFormProcessed] = useState({
        color: '',
        message: '',
        open: false
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewPass(prevValue => {
            return { ...prevValue, [name]: value }
        });
    };

    const handlePasswordShow = (name) => {
        if (name === 'newPassword') {
            setShowPassword(prevValue => {
                return { ...prevValue, newPassword: !showPassword.newPassword }
            })
        } else {
            setShowPassword(prevValue => {
                return { ...prevValue, newPasswordConfirm: !showPassword.newPasswordConfirm }
            })
        }
    }

    const handlePasswordChange = () => {
        if (newPass.newPassword !== newPass.newPasswordConfirm) {
            setFormProcessed({
                color: 'error',
                message: 'Passwords do not match',
                open: true
            })
        } else {
            console.log({newPass: newPass.newPassword});
            DataService.changePassword({password: newPass.newPassword}, localStorage.getItem('JWT')).then(res => {
                let colour;
                res.status === 200 ? colour = 'success' : colour = 'error';
                setFormProcessed({
                    color: colour,
                    message: res.data.message,
                    open: true
                })
            })
        }
        setTimeout(() => {
            localStorage.removeItem('JWT');
            window.location.reload();
        }, 3000);

    }


    return (
        <Modal
            open={props.open}
            onClose={handleClose}
        >
            <Box sx={{
                mx: 'auto',
                mt: '30vh',
                width: '40vw',
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 2,
                boxShadow: 10,
                textAlign: 'center',
                display: 'grid',
            }}>
                <Collapse in={formProcessed.open}>
                    <Alert severity={formProcessed.color}>
                        {formProcessed.message}
                    </Alert>
                </Collapse>
                <Typography variant="h4" mb={2}>Change your password</Typography>
                <FormControl sx={{ my: 1, mx: 'auto', }} variant='standard'>
                    <TextField label='New password' variant="standard" name="newPassword" value={newPass.newPassword} onChange={handleChange}
                        type={showPassword.newPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                        onClick={() => handlePasswordShow('newPassword')} >
                                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </FormControl>
                <FormControl sx={{ my: 1, mx: 'auto', }} variant='standard'>
                    <TextField label='Confirm new password' variant="standard" name="newPasswordConfirm" value={newPass.newPasswordConfirm} onChange={handleChange}
                        type={showPassword.newPasswordConfirm ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                        onClick={() => handlePasswordShow('newPasswordConfirm')} >
                                        {showPassword.newPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </FormControl>
                <Button variant="contained" sx={{ mt: 2, }} onClick={handlePasswordChange}>Change your password</Button>
            </Box>
        </Modal>
    )
}

export default ChangePasswordForm;