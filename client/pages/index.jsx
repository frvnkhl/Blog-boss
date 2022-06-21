import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import RegisterForm from '../components/RegisterForm'
import LoginForm from '../components/LoginForm'
import { Box } from '@mui/system'
import { Button, Card, CardContent, Paper, Typography } from '@mui/material'
import DataService from '../services/DataService'
import TokenService from '../services/TokenService'


const Home = () => {
  const [loggedIn, setLoggedIn] = useState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);


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
          <Box sx={{m: 5, p: 2, display: 'grid'}}>
            {articles == null ?
              <Typography variant='h3'>
                Sorry, no articles to show
              </Typography>
              :
              <Box>
              <Typography variant='h2' fontWeight='bold' mb={3} textAlign='center'>
                All articles
              </Typography>
                {articles.map(article => (
                  <Card>
                    <CardContent>
                      <Typography variant='h4' fontWeight='bold' mb={3}>
                        {article.title}
                      </Typography>
                      <Typography variant='p' dangerouslySetInnerHTML={{ __html: `${article.content.slice(0, 100)}...`}} />
                      <Button>Read more</Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            }
          </Box>
      }

      
    </>
  )
}



export default Home;