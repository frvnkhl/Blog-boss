import Head from 'next/head'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from '../components/Navbar'
import RegisterForm from '../components/RegisterForm'
import LoginForm from '../components/LoginForm'
import { Box } from '@mui/system'
import { Button, Card, CardContent, Typography } from '@mui/material'
import DataService from '../services/DataService'
import TokenService from '../services/TokenService'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'

const Home = () => {
  const [loggedIn, setLoggedIn] = useState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const checkIfLoggedIn = useCallback(() => {
    setLoading(true);
    //If not passed from the url, it will search for token in the local storage
    let accessToken = localStorage.getItem('JWT');
    if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
      setTimeout(() => setLoading(false), 2000);
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
      DataService.getAllArticles(accessToken).then(res => {
        setArticles(res.data.articles);
      })
      setTimeout(() => setLoading(false), 2000);
    }
  },
    [],
  )

  //Check the JWT token for authorisation in the first render
  useEffect(() => {
    checkIfLoggedIn();
  }, [checkIfLoggedIn])

  const filterArticles = (articles, filter) => {
    if (filter !== '') {
      return articles.filter(article => article.category.includes(filter));
    }
    else {
      return articles;
    }
  }

  const filteredArticles = useMemo(() => {
    return filterArticles(articles, filter)
  }, [articles, filter]);

  // const handleFilterChange = useCallback(() => {
  //   console.log({articles: filteredArticles, filter: filter});
  // }, [filteredArticles, filter]);

  return (
    <>
      <Head>Welcome to Blog Boss</Head>
      <Navbar />
      {
        !loggedIn ?
          <Box display="flex" flexDirection='row'>
            <Box flexGrow={0}>

            </Box>
            <Box display="flex" flexDirection="row" flexGrow={1}>
              <LoginForm />
              <RegisterForm />
            </Box>
          </Box>
          :
          <Box sx={{ m: 5, p: 2, display: 'grid' }}>
            {filteredArticles == null ?
              <Typography variant='h3'>
                Sorry, no articles to show
              </Typography>
              :
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateAreas: `"cat main main main"`
              }}>
                <Box sx={{
                  gridArea: 'cat',
                  p: '3'
                }}>
                  <Sidebar setFilter={setFilter}  />
                </Box>
                <Box sx={{ gridArea: 'main' }}>
                  <Typography variant='h2' fontWeight='bold' mb={3} textAlign='center'>
                    All articles
                  </Typography>
                  {filteredArticles.map(article => (
                    <Card>
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
                  ))}
                </Box>
              </Box>
            }
          </Box>
      }


    </>
  )
}



export default Home;