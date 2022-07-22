import { useMemo, useState } from 'react';
import { Box } from '@mui/system';
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import FlightIcon from '@mui/icons-material/Flight';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import DiamondIcon from '@mui/icons-material/Diamond';
import BrushIcon from '@mui/icons-material/Brush';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupsIcon from '@mui/icons-material/Groups';

const Sidebar = (props) => {

    const handleFilterChange = (event) => {
        const category = event.target.innerText.toLowerCase();
        props.setFilter(category);
        // props.onChange();
    };

    return (
        <Box>
            <Typography variant='h4'>
                Categories
            </Typography>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <FormatListBulletedIcon color='error' />
                </ListItemIcon>
                <ListItemText primary="All" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <GroupsIcon color='warning' />
                </ListItemIcon>
                <ListItemText primary="Followings" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <DinnerDiningIcon color='success' />
                </ListItemIcon>
                <ListItemText primary="Food" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <FlightIcon color='info' />
                </ListItemIcon>
                <ListItemText primary="Travel" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <DevicesIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary="Technology" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <PeopleIcon color='secondary' />
                </ListItemIcon>
                <ListItemText primary="Society" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <LocalHospitalIcon color='error' />
                </ListItemIcon>
                <ListItemText primary="Health" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <NightlifeIcon color='warning' />
                </ListItemIcon>
                <ListItemText primary="Lifestyle" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <DiamondIcon color='success' />
                </ListItemIcon>
                <ListItemText primary="Fashion" />
            </ListItemButton>
            <ListItemButton onClick={handleFilterChange} >
                <ListItemIcon>
                    <BrushIcon color='info' />
                </ListItemIcon>
                <ListItemText primary="Art" />
            </ListItemButton>
        </Box>
    )
}

export default Sidebar;