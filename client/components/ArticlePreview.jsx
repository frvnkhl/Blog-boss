import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

const ArticlePreview = (props) => {
    const article = props.article;

    return (
        <>
            <Card sx={{ my: 3 }} key={props.passedKey}>
                <CardContent>
                    <Typography variant='h4' fontWeight='bold' mb={3}>
                        {article.title}
                    </Typography>
                    <Typography variant='p' dangerouslySetInnerHTML={{ __html: `${article.content.slice(0, 100)}...` }} />
                    <Link href={`/article/${article._id}`}>
                        <Button>Read more</Button>
                    </Link>
                </CardContent>
            </Card>
        </>
    )
}

export default ArticlePreview;