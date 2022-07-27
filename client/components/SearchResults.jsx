import { Modal, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import DataService from "../services/DataService";
import ArticlePreview from "./ArticlePreview";

const SearchResults = (props) => {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        DataService.getAllArticles(localStorage.getItem('JWT')).then(res => {
            const filteredArticles = res.data.articles.filter(article => (article.tags.includes(props.search)) ||
                (article.title.includes(props.search)) || (article.content.includes(props.search)));
            setSearchResults(filteredArticles);
        });
    }, [props.search]);

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
        >
            <Box sx={{
                bgcolor: 'background.paper',
                top: '20vh',
                left: { xs: '3vw', md: '20vw' },
                position: 'absolute',
                width: { xs: '95%', md: '60vw' },
                p: 3,
                boxShadow: 15,
                maxHeight: '60vh',
                overflowY: 'auto',
            }}>
                {searchResults.length === 0 ?
                    <Typography variant="h4">{`Sorry, no search results for "${props.search}"`}</Typography> :
                    <>
                        <Typography variant="h4">{`Search results for "${props.search}"`}</Typography>
                        {
                            searchResults.map((article, index) => (
                                <ArticlePreview passedKey={index} key={index} article={article} />
                            ))
                        }
                    </>
                }
            </Box>
        </Modal>
    );
};

export default SearchResults;