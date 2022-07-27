import React, { useEffect, useCallback, useState } from "react";
import Navbar from "../../components/Navbar";
import TokenService from "../../services/TokenService";
import DataService from "../../services/DataService";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { Avatar, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { indigo } from "@mui/material/colors";
import EditIcon from '@mui/icons-material/Edit';
import ArticlePreview from "../../components/ArticlePreview";
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChangePasswordForm from "../../components/ChangePasswordForm";

const Profile = () => {
    const [loggedIn, setLoggedIn] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [userArticles, setUserArticles] = useState([]);
    const [likedArticles, setLikedArticles] = useState([]);
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const checkIfLoggedIn = useCallback(() => {
        setLoading(true);
        let accessToken = localStorage.getItem('JWT');
        if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
            setLoggedIn(false);
            router.push('/');
        } else {
            setLoggedIn(true);
            DataService.getCurrentUser(accessToken).then(res => {
                console.log({ user: res.data });
                setUser(res.data);
            });
            setLoading(false);
        }
    },
        [],
    );

    //Check the JWT token for authorisation in the first render
    useEffect(() => {
        checkIfLoggedIn();
    }, [checkIfLoggedIn]);

    //Check and set articles written and liked by user
    useEffect(() => {
        let accessToken = localStorage.getItem('JWT');
        DataService.getAllArticles(accessToken).then(res => {
            const filteredArticles = res.data.articles.filter(article => article.author === user.id);
            console.log({ articles: filteredArticles, allArticles: res.data.articles });
            setUserArticles(filteredArticles);
            if (user.favouriteArticles !== undefined && user.favouriteArticles.length > 0) {
                const likes = res.data.articles.filter(article => user.favouriteArticles.includes(article._id));
                setLikedArticles(likes);
            }
        });
    }, [user]);

    const dislikeArticle = (articleId) => {
        DataService.likeArticle(articleId, localStorage.getItem('JWT')).then(res =>
            window.location.reload()
        )
    };

    const deleteArticle = (articleId) => {
        DataService.deleteArticle(articleId, localStorage.getItem('JWT')).then(res =>
            window.location.reload()
        )
    };

    const handleOpen = () => setOpen(true);

    return (
        <>
            <Navbar loggedIn={loggedIn} />
            <Box sx={{ mx: 'auto', my: 5, width: { xs: '95%', md: '80%' }, px: { xs: 1, md: 10 }, py: 3, display: 'grid', boxShadow: 2 }}>
                {loading ?
                    <CircularProgress sx={{ mx: 'auto' }} /> :
                    <>
                        <Box sx={{
                            display: { xs: 'flex', md: 'grid' },
                            flexDirection: { xs: 'column' },
                            gridTemplateColumns: { md: 'repeat(4, 1fr)' },
                            gridTemplateAreas: { md: `"side main main main"` }
                        }}>
                            <Box sx={{ gridArea: { md: 'side' }, p: { xs: 1, md: 3 }, textAlign: 'center' }}>
                                <Avatar sx={{ width: 150, height: 150, bgcolor: indigo[600], mb: 1, mx: 'auto' }} />
                                <Typography>Followers</Typography>
                                <Typography fontStyle='bold'>{user.followers}</Typography>
                                <Typography>Following</Typography>
                                <Typography>{user.following}</Typography>
                                <Button onClick={handleOpen}>Change your password</Button>
                                <ChangePasswordForm open={open} setOpen={setOpen} />
                            </Box>
                            <Box sx={{ gridArea: { md: 'main' }, p: { xs: 1, md: 3 } }}>
                                <Typography variant='h4'>{user.username}</Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Typography variant="h5" sx={{ mb: 1 }}>My articles</Typography>
                                {
                                    userArticles.length === 0 ?
                                        <Box>
                                            <Typography fontStyle='italic'>You don't have any articles!</Typography>
                                            <Button variant="text" startIcon={<EditIcon />} href='/article/new'>Add new article</Button>
                                        </Box> :
                                        <Box>
                                            {
                                                userArticles.map((article, index) => (
                                                    <>
                                                        <ArticlePreview passedKey={index} key={index} article={article} />
                                                        <Button variant="text" color="error" onClick={() => deleteArticle(article._id)} startIcon={<DeleteIcon />}>{`Delete "${article.title}" article`}</Button>
                                                    </>
                                                ))
                                            }
                                        </Box>
                                }
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h5" sx={{ mb: 1 }}>Liked articles</Typography>
                                {
                                    likedArticles.length === 0 ?
                                        <Box>
                                            <Typography fontStyle='italic'>You haven't liked any articles!</Typography>
                                        </Box> :
                                        <Box>
                                            {
                                                likedArticles.map((article, index) => (
                                                    <>
                                                        <ArticlePreview passedKey={index} key={index} article={article} />
                                                        <Button variant="text" color="error" onClick={() => dislikeArticle(article._id)} startIcon={<ThumbDownIcon />}>{`Unlike "${article.title}" article`}</Button>
                                                    </>
                                                ))
                                            }
                                        </Box>
                                }
                            </Box>
                        </Box>
                    </>
                }
            </Box>
        </>
    );
};

export default Profile;