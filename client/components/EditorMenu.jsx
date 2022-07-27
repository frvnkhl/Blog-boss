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
        <Box sx={{ borderBottom: 1, borderColor: '#CACACA', pb: 1, justifyContent: 'center' }}>
            <ToggleButtonGroup>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    selected={props.editor.isActive('heading', { level: 1 }) ? true : false}
                    value='h1'
                >
                    <b>H1</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    selected={props.editor.isActive('heading', { level: 2 }) ? true : false}
                    value='h2'
                >
                    <b>H2</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    selected={props.editor.isActive('heading', { level: 3 }) ? true : false}
                    value='h3'
                >
                    <b>H3</b>
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBold().run()}
                    selected={props.editor.isActive('bold') ? true : false}
                    value='bold'
                >
                    <FormatBoldIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleItalic().run()}
                    selected={props.editor.isActive('italic') ? true : false}
                    value='italic'
                >
                    <FormatItalicIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleUnderline().run()}
                    selected={props.editor.isActive('underline') ? true : false}
                    value='underline'
                >
                    <FormatUnderlinedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleStrike().run()}
                    selected={props.editor.isActive('strike') ? true : false}
                    value='strike'
                >
                    <FormatStrikethroughIcon />
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup sx={{display: {sx: 'inline-flex', md: 'inline-block'}, mt:{xs: 1, md:0}, ml: {xs:0, md: 2}}}>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
                    selected={props.editor.isActive('blockquote') ? true : false}
                    value='blockquote'
                >
                    <FormatQuoteIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleBulletList().run()}
                    selected={props.editor.isActive('bulletList') ? true : false}
                    value='bulletList'
                >
                    <FormatListBulletedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
                    selected={props.editor.isActive('orderedList') ? true : false}
                    value='orderedList'
                >
                    <FormatListNumberedIcon />
                </ToggleButton>
                <ToggleButton
                    onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
                    selected={props.editor.isActive('codeBlock') ? true : false}
                    value='codeBlock'
                >
                    <CodeIcon />
                </ToggleButton>
                <ToggleButton onClick={setLink} selected={props.editor.isActive('link') ? true : false} value='link'>
                    <LinkIcon />
                </ToggleButton>
                <ToggleButton onClick={addImage} value='image'><ImageIcon /></ToggleButton>
            </ToggleButtonGroup>

        </Box>
    )
};

export default EditorMenu;