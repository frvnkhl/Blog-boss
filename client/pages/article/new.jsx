import { CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import TokenService from "../../services/TokenService";
import BlogForm from '../../components/BlogForm';

const NewArticle = () => {
    const [loggedIn, setLoggedIn] = useState();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkIfLoggedIn = useCallback(() => {
        setLoading(true);
        let accessToken = localStorage.getItem('JWT');
        if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
            setLoggedIn(false);
            router.push('/');
        } else {
            setLoggedIn(true);
        }
        setLoading(false);
    },
        [],
    );

    //Check the JWT token for authorisation in the first render
    useEffect(() => {
        checkIfLoggedIn();
    }, [checkIfLoggedIn]);

    return (
        <>
            <Navbar loggedIn={loggedIn} />
            {loading ?
                <CircularProgress sx={{ mx: 'auto' }} />
                :
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    style={{ minHeight: '100vh' }}
                >
                    <BlogForm />
                </Grid>
            }
        </>
    )
};

export default NewArticle;