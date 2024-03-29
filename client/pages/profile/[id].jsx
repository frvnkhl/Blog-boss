import { Avatar, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { indigo } from "@mui/material/colors";
import { useRouter } from "next/router";
import React, { useState, useCallback, useEffect } from "react";
import Navbar from "../../components/Navbar";
import DataService from "../../services/DataService";
import TokenService from "../../services/TokenService";
import ArticlePreview from "../../components/ArticlePreview";

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const [profile, setProfile] = useState('');
    const [loggedIn, setLoggedIn] = useState();
    const [profileArticles, setProfileArticles] = useState([]);
    const [likedArticles, setLikedArticles] = useState([]);
    const [isFollowed, setIsFollowed] = useState();
    const router = useRouter();

    const profileId = router.query.id;

    const checkIfLoggedIn = useCallback(() => {
        if (router.isReady) {
            let accessToken = localStorage.getItem('JWT');
            if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
                setLoggedIn(false);
                router.push('/');
            } else {
                setLoggedIn(true);
                DataService.getCurrentUser(accessToken).then(res => {
                    // console.log({ user: res.data });
                    setUser(res.data);
                });
                console.log({ userId: profileId });
                DataService.getUser(profileId, accessToken).then(res => {
                    // console.log({ profile: res.data });
                    setProfile(res.data);
                })
                setLoading(false);
            }
        }
    },
        [router],
    );

    //Check the JWT token for authorisation in the first render
    useEffect(() => {
        checkIfLoggedIn();
    }, [checkIfLoggedIn]);

    //Find and set articles written and liked by User
    useEffect(() => {
        const accessToken = localStorage.getItem('JWT');
        DataService.getAllArticles(accessToken).then(res => {
            const filteredArticles = res.data.articles.filter(article => article.author === profile.id);
            // console.log({ allArticles: res.data.articles, userArticles: filteredArticles });
            setProfileArticles(filteredArticles);
            if (profile.favouriteArticles !== undefined && profile.favouriteArticles.length > 0) {
                const likes = res.data.articles.filter(article => profile.favouriteArticles.includes(article._id));
                setLikedArticles(likes);
            }
        });
        setLoading(false);
    }, [profile, user]);

    //Check whether the user has followed this user or not
    useEffect(() => {
        if (!router.isReady) return;
        const accessToken = localStorage.getItem('JWT');
        DataService.getUserFollowers(profileId, accessToken).then(res => {
            // console.log({ followers: res, profileId: profileId });
            if (res.data === '' || !res.data.includes(user.id)) {
                setIsFollowed(false);
            } else {
                setIsFollowed(true);
            }
        });
        setLoading(false);
    }, [router, user]);

    const handleFollow = () => {
        DataService.followUser(profile.id, localStorage.getItem('JWT'));
        setLoading(true);
        window.location.reload();
    };

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
                                <Typography>{profile.followers}</Typography>
                                <Typography>Following</Typography>
                                <Typography>{profile.following}</Typography>
                                {
                                    isFollowed ?
                                        <Button color="error" onClick={handleFollow}>{`Unfollow ${profile.username}`}</Button> :
                                        <Button color="primary" onClick={handleFollow}>{`Follow ${profile.username}`}</Button>
                                }
                            </Box>
                            <Box sx={{ gridArea: { md: 'main' }, p: { xs: 1, md: 3 } }}>
                                <Typography variant="h4">{profile.username}</Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Typography variant="h5" sx={{ mb: 1 }}>{`${profile.username}'s articles`}</Typography>
                                {
                                    profileArticles.length === 0 ?
                                        <Box>
                                            <Typography fontStyle='italic'>{`${profile.username} hasn't posted any articles yet`}</Typography>
                                        </Box> :
                                        <Box>
                                            {
                                                profileArticles.map((article, index) => (
                                                    <div key={index}>
                                                        <ArticlePreview key={index} article={article} />
                                                    </div>
                                                ))
                                            }
                                        </Box>
                                }
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h5" sx={{ mb: 1 }}>Liked articles</Typography>
                                {
                                    likedArticles.length === 0 ?
                                        <Box>
                                            <Typography fontStyle='italic'>{`${profile.username} hasn't liked any articles yet`}</Typography>
                                        </Box> :
                                        <Box>
                                            {
                                                likedArticles.map((article, index) => (
                                                    <div key={index}>
                                                        <ArticlePreview key={index} article={article} />
                                                    </div>
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
    )
};

export default UserProfile;