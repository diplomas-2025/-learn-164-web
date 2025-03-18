import React, {useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import {getCurrentUser} from "../api/api";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({});
    const [anchorEl, setAnchorEl] = React.useState(null); // Для меню пользователя

    // Обработчик открытия меню
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Обработчик закрытия меню
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getCurrentUser().then((res) => { setUser(res.data); });
    }, [])

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #6a11cb, #2575fc)' }}>
            <Toolbar>
                {/* Логотип школы */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <SchoolIcon sx={{ fontSize: 50, color: '#fff', mr: 2 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                        МБОУ СОШ №164
                    </Typography>
                </Box>

                {/* Меню пользователя */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#fff', mr: 2 }}>
                        {user.fullName}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleMenuClose()
                            navigate('/profile')
                        }}>Профиль</MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose()
                            localStorage.removeItem('token')
                            window.location.reload()
                        }}>Выйти</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;