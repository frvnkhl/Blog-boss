import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Divider, Chip, Avatar, IconButton } from "@mui/material";
import Navbar from "../../components/Navbar";
import DataService from "../../services/DataService";
import TokenService from "../../services/TokenService";
import parse, { attributesToProps } from "html-react-parser"
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import CommentBox from "../../components/CommentBox";
import SearchResults from "../../components/SearchResults";

const Article = () => {
    const [loggedIn, setLoggedIn] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [article, setArticle] = useState('');
    const [author, setAuthor] = useState('');
    const [user, setUser] = useState('');
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const articleId = router.query.id;

    //Options to resize every added picture, so the page renders correctly on all screen sizes
    const options = {
        replace: domNode => {
            if (domNode.attribs && domNode.name === 'img') {
                const props = attributesToProps(domNode.attribs);
                return <img width='300' {...props}/>
            }
        }
    };

    const checkIfLoggedIn = useCallback(() => {
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
    };

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
    };

    const handleTagClick = (event) => {
        const tag = event.target.innerText;
        setSearch(tag);
        handleOpen();
    };

    const handleUserProfileRedirect = (id) => {
        router.push(`/profile/${id}`);
    };

    return (
        <>
            <Navbar loggedIn={loggedIn}/>
            <Box sx={{ mx: 'auto', my: 5, width: {xs: '95%', md: '80%'}, px: {xs: 2, md: 5}, py: 3, display: 'grid', boxShadow: 2 }}>
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
                                    sx={{ width: '200px', height: '40px', mx: 'auto'}}
                                    clickable
                                    onClick={() => handleUserProfileRedirect(author.id)}
                                />
                            </Box>

                        }
                        <Divider sx={{ my: 3 }} />
                        <Box sx={{width: {xs:'95%', md: '80%'}}}>
                            {article !== '' && parse(article.content, options)}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Box>
                            <Box sx={{ display: 'inline-block' }}>
                                <Typography variant="h5">Tags</Typography>
                                {article !== '' &&
                                    article.tags.map((tag, index) => (
                                        <Chip key={index} sx={{ mr: 2, mt: 2 }} label={tag} color="primary" clickable onClick={handleTagClick}/>
                                    ))
                                }
                            </Box>
                            <SearchResults open={open} handleClose={handleClose} search={search} />
                            <Box sx={{ display: 'inline-block', ml: {md: 3}, mt: {xs: 2} }}>
                                <Typography variant="h5">Categories</Typography>
                                {article !== '' &&
                                    article.category.map((category, index) => (
                                        <Chip key={index} sx={{ mr: 2, mt: 2 }} label={category} color="success" clickable onClick={handleCategoryClick} />
                                    ))
                                }
                            </Box>
                            <Box sx={{ display: 'inline-block', float: 'right', mt: { xs: 2 } }}>
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
    );
};

export default Article;