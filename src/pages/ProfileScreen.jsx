import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import {getCoursesEnrolledByUser, getCurrentUser, getTestResults} from "../api/api";
import {useNavigate} from "react-router-dom";

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Данные пользователя
    const [completedTests, setCompletedTests] = useState([]); // Пройденные тесты
    const [enrolledCourses, setEnrolledCourses] = useState([]); // Записанные курсы
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await getCurrentUser(); // Получаем данные пользователя
                const testsResponse = await getTestResults();
                const coursesResponse = await getCoursesEnrolledByUser();

                setUser(userResponse.data);
                setCompletedTests(testsResponse.data);
                setEnrolledCourses(coursesResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" mt={4}>
                {error}
            </Typography>
        );
    }

    const getRoleLabel = (role) => {
        switch (role) {
            case "INSTRUCTOR":
                return "Преподаватель";
            case "STUDENT":
                return "Студент";
            default:
                return "Неизвестная роль";
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Информация о пользователе */}
            {user && (
                <Card sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {user.fullName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
                        Email: {user.email}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
                        Роль: {getRoleLabel(user.role)}
                    </Typography>
                </Card>
            )}

            {/* Пройденные тесты */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Пройденные тесты
                </Typography>
                <Grid container spacing={3}>
                    {completedTests.map((test) => (
                        <Grid item key={test.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                        {test.test.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        Результат: {test.score}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Дата прохождения: {new Date(test.createdAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Записанные курсы */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Ваши курсы
                </Typography>
                <Grid container spacing={3}>
                    {enrolledCourses.map((course) => (
                        <Grid item key={course.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        cursor: 'pointer',
                                    },
                                }}
                                onClick={() => navigate("/courses/" + course.id)}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                        {course.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        Преподаватель: {course.instructor.fullName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Жанр: {course.genre.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Дата записи: {new Date(course.userEnrolledInCourseAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default ProfileScreen;