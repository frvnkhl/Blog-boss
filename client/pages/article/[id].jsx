import Router, { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Divider, Chip, Avatar, IconButton, Card, CardContent, CardActions, TextField, Button } from "@mui/material";
import Navbar from "../../components/Navbar";
import DataService from "../../services/DataService";
import TokenService from "../../services/TokenService";
import parse from "html-react-parser"
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import CommentBox from "../../components/CommentBox";

const Article = () => {
    const [loggedIn, setLoggedIn] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [article, setArticle] = useState('');
    const [author, setAuthor] = useState('');
    const [user, setUser] = useState('');

    const articleId = router.query.id;

    const checkIfLoggedIn = useCallback(() => {
        //If not passed from the url, it will search for token in the local storage
        if (router.isReady) {
            console.log({ articleId: articleId });
            let accessToken = localStorage.getItem('JWT');
            if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
                setLoggedIn(false);
                router.push('/');
            } else {
                setLoggedIn(true);
                const token = localStorage.getItem('JWT');
                DataService.getArticle(articleId, token).then(res => {
                    console.log({ response: res });
                    setArticle(res.data.article);
                    setWriter(res.data.article.author);
                }).catch(err => {
                    console.log({ fetchingError: err });
                });
                console.log({ article: article });
                DataService.getCurrentUser(token).then(res => {
                    console.log({ user: res.data });
                    setUser(res.data);
                }).catch(err => {
                    console.log({ error: err })
                })
            }
            setLoading(false);
        }
    },
        [router],
    )

    //Check the JWT token for authorisation in the first render
    useEffect(() => {
        checkIfLoggedIn();
    }, [checkIfLoggedIn]);

    const setWriter = (userId) => {
        DataService.getUser(userId, localStorage.getItem('JWT')).then(res => {
            setAuthor(res.data);
        });
    }

    const likeArticle = () => {
        DataService.likeArticle(articleId, localStorage.getItem('JWT')).then(res =>
            window.location.reload()
        );
    };

    const handleCategoryClick = (event) => {
        const category = event.target.innerText;
        router.push({
            pathname: '/',
            query: { category: category }
        }, '/');
    }

    const handleUserProfileRedirect = (id) => {
        router.push(`/profile/${id}`);
    }

    return (
        <>
            <Navbar />
            <Box sx={{ mx: 'auto', my: 5, width: '80%', px: 10, py: 3, display: 'grid', boxShadow: 2 }}>
                {loading ?
                    <CircularProgress sx={{ mx: 'auto' }} />
                    :
                    <>
                        <Typography variant="h2" textAlign='center'>
                            {article.title}
                        </Typography>
                        {
                            author !== '' &&
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                            }}
                            >
                                <Chip
                                    avatar={<Avatar>{author.username.slice(0, 1).toUpperCase()}</Avatar>}
                                    label={`By ${author.username}`}
                                    sx={{ width: '200px', height: '40px', }}
                                    clickable
                                    onClick={() => handleUserProfileRedirect(author.id)}
                                />
                            </Box>

                        }
                        <Divider sx={{ my: 3 }} />
                        <Box>
                            {article !== '' && parse(article.content)}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Box >
                            <Box sx={{ display: 'inline-block' }}>
                                <Typography variant="h5">Tags</Typography>
                                {article !== '' &&
                                    article.tags.map((tag, index) => (
                                        <Chip key={index} sx={{ mr: 2, mt: 2 }} label={tag} color="primary" clickable />
                                    ))
                                }
                            </Box>
                            <Box sx={{ display: 'inline-block', ml: 3 }}>
                                <Typography variant="h5">Categories</Typography>
                                {article !== '' &&
                                    article.category.map((category, index) => (
                                        <Chip key={index} sx={{ mr: 2, mt: 2 }} label={category} color="success" clickable onClick={handleCategoryClick} />
                                    ))
                                }
                            </Box>
                            <Box sx={{ display: 'inline-block', float: 'right' }}>
                                <Typography variant="h5">Likes</Typography>
                                {article !== '' &&
                                    <Box sx={{ display: 'inline' }}>
                                        <Typography>{article.likes} likes</Typography>
                                        {(user.favouriteArticles !== undefined && user.favouriteArticles.includes(articleId)) ?
                                            <IconButton color="error" onClick={likeArticle}>
                                                <ThumbDown />
                                            </IconButton>
                                            :
                                            <IconButton color="primary" onClick={likeArticle}>
                                                <ThumbUp />
                                            </IconButton>
                                        }
                                    </Box>
                                }
                            </Box>
                        </Box>
                    </>
                }
            </Box>
            {
                article !== '' &&
                <CommentBox article={article} user={user} articleId={articleId} />
            }

        </>
    )
}

export default Article;