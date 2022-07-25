import { Box, IconButton, Typography, Menu, MenuItem, Toolbar, InputBase, Tooltip, AppBar } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreIcon from '@mui/icons-material/MoreVert';
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import TokenService from "../services/TokenService";
import Link from "next/link";
import SearchResults from "./SearchResults";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const checkIfLoggedIn = useCallback(() => {
        //If not passed from the url, it will search for token in the local storage
        let accessToken = localStorage.getItem('JWT');
        if (accessToken === null || !TokenService.isTokenValid(accessToken)) {
            setLoggedIn(false);
        } else {
            setLoggedIn(true);
        }
    },
        [],
    )

    //Check the JWT token for authorisation in the first render
    useEffect(() => {
        checkIfLoggedIn();
    }, [checkIfLoggedIn])

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        localStorage.removeItem('JWT');
        router.push('/').then(router.reload());
    }

    const handleChange = (event) => {
        const {value} = event.target;
        setSearch(value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleOpen();
        }
    }

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    href="/profile"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={() => router.push('/article/new')}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <EditIcon />
                </IconButton>
                <p>Add new article</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <SettingsIcon />
                </IconButton>
                <p>Settings</p>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );


    return (
        <Box>
            {loggedIn ?
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static" sx={{ bgcolor: '#1e1e1e' }}>
                            <Toolbar>
                                <Link href='/'>
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        component="div"
                                        sx={{ display: 'block' }}
                                    >
                                        Blog Boss
                                    </Typography>
                                </Link>
                                <Search sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleChange}
                                        value={search}
                                        onKeyDown={handleKeyDown}
                                    />
                                </Search>
                                <SearchResults open={open} handleClose={handleClose} search={search} />
                                <Box sx={{ flexGrow: 1 }} />
                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                    <Tooltip title="Write new article">
                                        <IconButton
                                            size="large"
                                            color="inherit"
                                            href="/article/new"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Settings">

                                        <IconButton
                                            size="large"
                                            color="inherit"
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="My profile">
                                        <IconButton
                                            size="large"
                                            edge="end"
                                            aria-label="account of current user"
                                            color="inherit"
                                            href="/profile"
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Logout">
                                        <IconButton
                                            size="large"
                                            edge="end"
                                            aria-label="account of current user"
                                            sx={{ color: 'red' }}
                                            onClick={handleLogout}
                                        >
                                            <LogoutIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                    <IconButton
                                        size="large"
                                        aria-label="show more"
                                        aria-controls={mobileMenuId}
                                        aria-haspopup="true"
                                        onClick={handleMobileMenuOpen}
                                        color="inherit"
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </Box>
                            </Toolbar>
                        </AppBar>
                        {renderMobileMenu}
                    </Box>
                </>
                :
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static" sx={{ bgcolor: '#1e1e1e' }}>
                            <Toolbar>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ display: { xs: 'none', sm: 'block' } }}
                                >
                                    Blog Boss
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </>
            }

        </Box>

    );
}


export default Navbar;