import { ToggleButton, Box, ToggleButtonGroup } from "@mui/material";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { useCallback } from "react";


const EditorMenu = (props) => {

    const addImage = useCallback(() => {
        const url = window.prompt('Add URL of your image')

        if (url) {
            props.editor.chain().focus().setImage({ src: url }).run()
        }
    }, [props.editor]);

    const setLink = useCallback(() => {
        const previousUrl = props.editor.getAttributes('link').href
        const url = window.prompt('Add your link URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            props.editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        props.editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [props.editor])



    return (
        <Box sx={{ borderBottom : 1, borderColor: '#CACACA', pb: 1}}>
        <ToggleButtonGroup>
                <ToggleButton
                    variant="text"
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    selected={props.editor.isActive('heading', { level: 1 }) ? true : false}
                >
                    <b>H1</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    selected={props.editor.isActive('heading', { level: 2 }) ? true : false}
                >
                    <b>H2</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    selected={props.editor.isActive('heading', { level: 3 }) ? true : false}
                >
                    <b>H3</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBold().run()}
                    selected={props.editor.isActive('bold') ? true : false}
                >
                    <FormatBoldIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleItalic().run()}
                    selected={props.editor.isActive('italic') ? true : false}
                >
                    <FormatItalicIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleUnderline().run()}
                    selected={props.editor.isActive('underline') ? true : false}
                >
                    <FormatUnderlinedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleStrike().run()}
                    selected={props.editor.isActive('strike') ? true : false}
                >
                    <FormatStrikethroughIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
                    selected={props.editor.isActive('blockquote') ? true : false}
                >
                    <FormatQuoteIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBulletList().run()}
                    selected={props.editor.isActive('bulletList') ? true : false}
                >
                    <FormatListBulletedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
                    selected={props.editor.isActive('orderedList') ? true : false}
                >
                    <FormatListNumberedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
                    selected={props.editor.isActive('codeBlock') ? true : false}
                >
                    <CodeIcon />
                </ToggleButton>
                <ToggleButton onClick={setLink} selected={props.editor.isActive('link') ? true : false}>
                    <LinkIcon />
                </ToggleButton>
                <ToggleButton onClick={addImage}><ImageIcon /></ToggleButton>
        </ToggleButtonGroup>
        </Box>
    )
};

export default EditorMenu;