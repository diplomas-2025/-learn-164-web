import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Link, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import {signIn, signUp} from "../api/api"; // Иконка школы

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true); // Переключатель между логином и регистрацией
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(''); // Только для регистрации
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                signIn({email, password}).then(response => {
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('username', response.data.username);
                    window.location.reload();
                })
            }else {
                signUp({firstName, email, password}).then(response => {
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('username', response.data.username);
                    window.location.reload();
                })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Произошла ошибка');
            console.error('Ошибка:', err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #6a11cb, #2575fc)', // Градиентный фон
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 4,
                    maxWidth: 400,
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.9)', // Полупрозрачный белый фон
                    backdropFilter: 'blur(10px)', // Размытие
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 50, color: '#6a11cb' }} /> {/* Иконка школы */}
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        МБОУ СОШ №164
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ color: '#555' }}>
                        {isLogin ? 'Вход в систему' : 'Регистрация'}
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {!isLogin && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Имя"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
                        />
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                            },
                        }}
                    >
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{ color: '#2575fc', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default AuthScreen;