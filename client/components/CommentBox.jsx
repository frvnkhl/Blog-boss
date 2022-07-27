import { Box, Typography, Divider, IconButton, Card, CardContent, CardActions, TextField, Button, Link } from "@mui/material";
import DataService from "../services/DataService";
import { useState } from "react";
import { Send, ThumbUp, ThumbDown, Close } from "@mui/icons-material";

const CommentBox = (props) => {
    const [newComment, setNewComment] = useState({
        comment: ''
    });
    const [commentAuthors, setCommentAuthors] = useState([]);
    const article = props.article;
    const user = props.user;

    const getUserById = (userId) => {
        DataService.getUser(userId, localStorage.getItem('JWT')).then(res => {
            const user = {
                id: res.data.id,
                username: res.data.username,
                followers: res.data.followers,
                following: res.data.following
            };
            const foundUser = commentAuthors.filter(author => author.id === userId);
            if (foundUser.length === 0) {
                setCommentAuthors(prevState => [...prevState, user]);
            }
        });
    };

    const getUsername = (userId) => {
        getUserById(userId);
        const foundUser = commentAuthors.filter(user => user.id === userId);
        return foundUser.length > 0 && foundUser[0].username;
    };

    const handleCommentChange = (event) => {
        const { value } = event.target;
        setNewComment({ comment: value });
    };

    const addComment = () => {
        DataService.addNewComment(props.articleId, newComment, localStorage.getItem('JWT')).then(res => {
            window.location.reload();
        });
    };

    const handleCommentLike = (commentId) => {
        DataService.likeComment(props.articleId, commentId, localStorage.getItem('JWT')).then(res => {
            window.location.reload();
        });
    };

    const handleCommentDelete = (commentId) => {
        DataService.deleteComment(props.articleId, commentId, localStorage.getItem('JWT')).then(res => {
            window.location.reload();
        });
    };

    return (
        <>
            <Box sx={{ mx: 'auto', my: 5, width: { xs: '95%', md: '80%' }, px: { xs: 2, md: 5 }, py: 3, display: 'grid', boxShadow: 2 }}>
                <Typography variant="h4">{article.comments.length === 1 ? `${article.comments.length} Comment` : `${article.comments.length} Comments`}</Typography>
                <Divider sx={{ my: 3 }} />
                {article.comments.length > 0 ?
                    article.comments.map((comment, index) => (
                        <Card key={index} sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, '&:hover': { width: '120%' } }} color="text.secondary" gutterBottom>
                                    <Link underline='hover' href={`/profile/${comment.author}`}>
                                        {getUsername(comment.author)}
                                    </Link>
                                </Typography>
                                <Typography variant="p">
                                    {comment.comment}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Box sx={{ display: 'flex', width: '100%' }}>
                                    <Box>
                                        <Typography variant="p" ml={1}>{comment.likes.length === 1 ? `${comment.likes.length} like` : `${comment.likes.length} likes`}</Typography>
                                        {(comment.likes.includes(user.id)) ?
                                            <IconButton color="error" onClick={() => handleCommentLike(comment._id)}>
                                                <ThumbDown />
                                            </IconButton>
                                            :
                                            <IconButton color="primary" onClick={() => handleCommentLike(comment._id)} >
                                                <ThumbUp />
                                            </IconButton>
                                        }
                                    </Box>
                                    {comment.author === user.id || comment.author === article.author &&
                                        <IconButton color="error" onClick={() => handleCommentDelete(comment._id)} >
                                            <Close />
                                        </IconButton>
                                    }
                                </Box>
                            </CardActions>
                        </Card>
                    ))
                    :
                    <Typography>
                        No one has commented this article yet. Be first!
                    </Typography>
                }
                <Divider sx={{ my: 3 }} />
                <Typography variant="h4">New comment</Typography>
                <TextField
                    id="outlined-multiline-static"
                    label="Comment"
                    multiline
                    rows={4}
                    placeholder="Write your comment"
                    sx={{ mt: 2 }}
                    value={newComment.comment}
                    onChange={handleCommentChange}
                />
                <Button sx={{ mt: 2, width: '300px', mx: 'auto' }} variant='contained' endIcon={<Send />} onClick={addComment}>Add comment</Button>
            </Box>
        </>
    );
};

export default CommentBox;