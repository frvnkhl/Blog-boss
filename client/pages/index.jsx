import Head from 'next/head'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from '../components/Navbar'
import RegisterForm from '../components/RegisterForm'
import LoginForm from '../components/LoginForm'
import { Box } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import DataService from '../services/DataService'
import TokenService from '../services/TokenService'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/router'
import ArticlePreview from '../components/ArticlePreview'

const Home = () => {
  const [loggedIn, setLoggedIn] = useState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('All Articles');
  const [user, setUser] = useState('');
  const [followedUsersArticles, setFollowedUsersArticles] = useState([]);
  const router = useRouter();

  const checkIfLoggedIn = useCallback(() => {
    if(router.isReady) {
       //Check if token was passed from 3rd party login
       const {token} = router.query;
       if(token !== undefined) {
        localStorage.setItem('JWT', token);
        router.push('/');
       }
      //If not passed from the url, it will search for token in the local storage
      const accessToken = localStorage.getItem('JWT');
      if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
        setTimeout(() => setLoading(false), 2000);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        DataService.getCurrentUser(accessToken).then(res => {
          console.log({ user: res.data });
          setUser(res.data);
        });
        if (router.query.category !== undefined) {
          setFilter(router.query.category)
        }
        DataService.getAllArticles(accessToken).then(res => {
          setArticles(res.data.articles);
        });
        setTimeout(() => setLoading(false), 2000);
      }
    }  
  },
    [router],
  );

  useEffect(() => {
    if (user !== '' && articles !== []) {
      const accessToken = localStorage.getItem('JWT');
      DataService.getUserFollowings(user.id, accessToken).then((res) => {
        setFollowedUsersArticles(articles.filter(article => res.data.includes(article.author)));
      });
    };
    setLoading(false);
  }, [articles, user]);

  //Check the JWT token for authorisation in the first render
  useEffect(() => {
    checkIfLoggedIn();
  }, [checkIfLoggedIn])

  const filterArticles = (articles, filter) => {
    if (filter !== '' && filter !== 'all') {
      if (filter !== 'followings') {
        setTitle(`${filter[0].toUpperCase()}${filter.slice(1)} Articles`);
        return articles.filter(article => article.category.includes(filter));
      } else {
        setTitle('Articles of followed users');
        console.log({ filteredArticles: followedUsersArticles });
        return followedUsersArticles;
      }
    }
    setTitle('All articles');
    return articles;
  }

  const filteredArticles = useMemo(() => {
    const result = filterArticles(articles, filter)
    console.log({ articles: result });
    return result;
  }, [articles, filter]);

  // const handleFilterChange = useCallback(() => {
  //   console.log({articles: filteredArticles, filter: filter});
  // }, [filteredArticles, filter]);

  return (
    <>
      <Head>Welcome to Blog Boss</Head>
      <Navbar loggedIn={loggedIn} />
      {loading ?
        <CircularProgress sx={{ mx: 'auto' }} /> :
        <>
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
                {filteredArticles == null || filteredArticles === undefined ?
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
                      <Sidebar setFilter={setFilter} />
                    </Box>
                    <Box sx={{ gridArea: 'main' }}>
                      <Typography variant='h2' fontWeight='bold' mb={3} textAlign='center'>
                        {title}
                      </Typography>
                      {filteredArticles.map(article => (
                        <ArticlePreview article={article} />
                      ))}
                    </Box>
                  </Box>
                }
              </Box>
          }
        </>
      }
    </>
  )
}

export default Home;