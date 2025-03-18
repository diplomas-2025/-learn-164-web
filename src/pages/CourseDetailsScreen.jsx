import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Dialog, // Импорт компонента Dialog
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {createTopic, enrollUserToCourse, getAllTopics, getCourseById, isTeacher} from '../api/api'; // Импорт функции addTopic

const CourseDetailsScreen = () => {
    const { id } = useParams(); // Получаем ID курса из URL
    const navigate = useNavigate();
    const [course, setCourse] = useState(null); // Информация о курсе
    const [topics, setTopics] = useState([]); // Список тем
    const [filteredTopics, setFilteredTopics] = useState([]); // Отфильтрованные темы
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Поиск по названию темы
    const [sortOrder, setSortOrder] = useState('asc'); // Сортировка по названию темы
    const [openAddTopicDialog, setOpenAddTopicDialog] = useState(false); // Состояние для модального окна
    const [newTopicTitle, setNewTopicTitle] = useState(''); // Состояние для названия новой темы
    const [newTopicDescription, setNewTopicDescription] = useState(''); // Состояние для описания новой темы

    // Загрузка данных о курсе и темах
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await getCourseById(id);
                const topicsResponse = await getAllTopics(id);

                setCourse(courseResponse.data);
                setTopics(topicsResponse.data);
                setFilteredTopics(topicsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Поиск по названию темы
    useEffect(() => {
        const filtered = topics.filter((topic) =>
            topic.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTopics(filtered);
    }, [searchTerm, topics]);

    // Сортировка по названию темы
    const handleSort = () => {
        const sorted = [...filteredTopics].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        setFilteredTopics(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Запись на курс
    const handleEnroll = async () => {
        try {
            await enrollUserToCourse(id);
            // Обновляем информацию о курсе после записи
            const courseResponse = await getCourseById(id);
            setCourse(courseResponse.data);
        } catch (err) {
            setError('Ошибка при записи на курс');
        }
    };

    // Обработчик открытия модального окна для добавления темы
    const handleAddTopicClick = () => {
        setOpenAddTopicDialog(true);
    };

    // Обработчик закрытия модального окна
    const handleCloseAddTopicDialog = () => {
        setOpenAddTopicDialog(false);
        setNewTopicTitle('');
        setNewTopicDescription('');
    };

    // Обработчик сохранения новой темы
    const handleSaveTopic = async () => {
        if (newTopicTitle.trim() === '' || newTopicDescription.trim() === '') {
            alert('Название и описание темы не могут быть пустыми');
            return;
        }

        try {
            const response = await createTopic({
                title: newTopicTitle,
                description: newTopicDescription,
                courseId: id
            });
            setTopics([...topics, response.data]);
            setFilteredTopics([...filteredTopics, response.data]);
            setOpenAddTopicDialog(false);
            setNewTopicTitle('');
            setNewTopicDescription('');
        } catch (err) {
            setError('Ошибка при добавлении темы');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
                {/* Информация о курсе */}
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    {course.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {course.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Преподаватель: {course.instructor.fullName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Жанр: {course.genre.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Дата создания: {new Date(course.createdAt).toLocaleDateString()}
                </Typography>

                {/* Кнопка записи на курс или информация о записи */}
                {course.isUserEnrolledInCourse ? (
                    <Typography variant="body2" sx={{ mt: 3, color: 'green' }}>
                        Вы записаны на курс с {new Date(course.userEnrolledInCourseAt).toLocaleDateString()}
                    </Typography>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleEnroll}
                        sx={{
                            mt: 3,
                            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                            },
                        }}
                    >
                        Записаться на курс
                    </Button>
                )}

                {/* Список тем */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                        Темы курса
                    </Typography>

                    {/* Поиск и сортировка */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Поиск тем..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSort}
                            startIcon={<SortIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                color: '#fff',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                },
                            }}
                        >
                            {sortOrder === 'asc' ? 'А-Я' : 'Я-А'}
                        </Button>
                        {isTeacher() &&
                            <Button
                                variant="contained"
                                onClick={handleAddTopicClick}
                                startIcon={<AddIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                    },
                                }}
                            >
                                Добавить тему
                            </Button>
                        }
                    </Box>

                    {/* Отображение тем */}
                    <List>
                        {filteredTopics.map((topic) => (
                            <ListItem key={topic.id} sx={{ borderBottom: '1px solid #eee' }}>
                                <ListItemText
                                    primary={topic.title}
                                    secondary={topic.description}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (course.isUserEnrolledInCourse)
                                            navigate(`/courses/${id}/topics/${topic.id}`);
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>

            {/* Модальное окно для добавления темы */}
            <Dialog open={openAddTopicDialog} onClose={handleCloseAddTopicDialog}>
                <DialogTitle>Добавить новую тему</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название темы"
                        type="text"
                        fullWidth
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Описание темы"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newTopicDescription}
                        onChange={(e) => setNewTopicDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddTopicDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveTopic} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CourseDetailsScreen;