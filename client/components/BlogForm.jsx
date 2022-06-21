// ToDo delete draft-js
import { Box, FormControl, TextField, Typography, Button, Autocomplete, Chip, Alert } from "@mui/material";
import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenu from "./EditorMenu";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import DataService from "../services/DataService";
import { useRouter } from "next/router";

const BlogForm = () => {
    const [article, setArticle] = useState({
        title: '',
        content: '',
        category: [],
        tags: []
    });
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link,
        ],
        content: '<p>Your great story starts here! 🌎️</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setArticle(prevState => {
                return { ...prevState, content: html }
            })
        }
    });
    const blogCategories = ['food', 'travel', 'technology', 'society', 'health', 'lifestyle', 'fashion', 'art'];
    const [tagsInput, setTagsInput] = useState('');

    const router = useRouter();

    if (!editor) {
        return null
    }


    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log();
        setArticle(prevInput => {
            return { ...prevInput, [name]: value };
        });
    }

    const handleTagsInputChange = (event) => {
        const { value } = event.target;
        setTagsInput(value);
    }

    const onKeyDown = (e) => {
        const { key } = e;
        const trimmedInput = tagsInput.trim();

        if (key === ',' && trimmedInput.length && !article.tags.includes(trimmedInput)) {
            e.preventDefault();
            const newTagsArr = article.tags;
            newTagsArr.push(trimmedInput)
            setArticle(prevState => {
                return { ...prevState, tags: newTagsArr };
            })
            setTagsInput('');
        }
    };

    const handleDelete = (event, arg1) => {
        const tags = article.tags;
        const filteredTagsArr = tags.filter(tag => tag !== arg1);
        setArticle(prevState => {
            return { ...prevState, tags: filteredTagsArr };
        })
    };

    const handleCatChange = (selectedValue) => {
        setArticle(prevInput => {
            return { ...prevInput, category: selectedValue }
        })
    }

    const addArticle = async () => {
        const html = editor.getHTML();
        setArticle(prevInput => {
            return { ...prevInput, content: html.toString() }
        });

        const accessToken = localStorage.getItem('JWT');
        await DataService.addNewArticle(article, accessToken).then(res => {
            console.log({ response: res });
            router.push('/');
        }).catch(err => {
            console.log({ error: err });
        });
        setArticle({
            title: '',
            content: '',
            category: [],
            tags: []
        })
    }

    return (
        <Box sx={{ m: 5, width: '80%', p: 2, display: 'grid', boxShadow: 2 }}>
            <Typography variant="h3" fontWeight='bold' textAlign='center' mt={3} mb={3}>
                Write new article
            </Typography>
            <FormControl sx={{ m: 1, }} variant="standard">
                <TextField id="standard-basic" label="Title" variant="standard" name="title" value={article.title} onChange={handleChange} />
            </FormControl>
            <Box sx={{ m: 1, boxShadow: 2, p: 2 }}>
                <EditorMenu editor={editor} />
                <EditorContent editor={editor} />
                {/* <Button onClick={handleEditorChange}>Save</Button> */}
            </Box>
            <Autocomplete
                sx={{ m: 1 }}
                multiple
                id="tags-standard"
                options={blogCategories}
                filterSelectedOptions
                // getOptionLabel={(option) => option.title}
                defaultValue={article.category}
                value={article.category}
                name="category"
                onChange={(event, selectedValue) => handleCatChange(selectedValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Category"
                        placeholder="Choose relevant categories"

                    />
                )}
            />

            <TextField
                sx={{ m: 1 }}
                variant="standard"
                label="Tags"
                placeholder="Write relevant tags and separate them with a comma (',')"
                name="tags"
                value={tagsInput}
                onChange={handleTagsInputChange}
                onKeyDown={onKeyDown}
            />
            <Box sx={{ display: 'inline-block', m: 1 }}>
                {article.tags.map((tag, index) => (
                    <Chip mx={3} key={index} sx={{ mr: 1 }} label={tag} id={index}
                        onDelete={(event) => handleDelete(event, tag)} />
                ))}
            </Box>
            <Button onClick={addArticle} sx={{ m: 1 }}>
                Add Article
            </Button>

        </Box>
    )
}




export default BlogForm;