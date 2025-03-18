import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Button,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Tooltip,
    Dialog, // Импорт компонента Dialog
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {createCourse, getAllCourses, isTeacher} from '../api/api'; // Импорт функции addCourse
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AddIcon from '@mui/icons-material/Add';

const CoursesScreen = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [groupBy, setGroupBy] = useState('none');
    const [filterByEnrollment, setFilterByEnrollment] = useState(false);
    const [filterByInstructor, setFilterByInstructor] = useState('');
    const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false); // Состояние для модального окна
    const [newCourseTitle, setNewCourseTitle] = useState(''); // Состояние для названия нового курса
    const [newCourseDescription, setNewCourseDescription] = useState(''); // Состояние для описания нового курса
    const location = useLocation();
    const genreId = new URLSearchParams(location.search).get('genreId');

    // Загрузка курсов
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCourses();
                const filtered = genreId
                    ? response.data.filter((course) => course.genre.id === parseInt(genreId))
                    : response.data;
                setCourses(filtered);
                setFilteredCourses(filtered);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchCourses();
    }, [genreId]);

    // Фильтрация курсов
    useEffect(() => {
        let filtered = [...courses];

        if (searchTerm) {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterByEnrollment) {
            filtered = filtered.filter((course) => course.isUserEnrolledInCourse);
        }

        if (filterByInstructor) {
            filtered = filtered.filter((course) => course.instructor.id === parseInt(filterByInstructor));
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        if (groupBy === 'instructor') {
            filtered.sort((a, b) => a.instructor.fullName.localeCompare(b.instructor.fullName));
        } else if (groupBy === 'genre') {
            filtered.sort((a, b) => a.genre.name.localeCompare(b.genre.name));
        }

        setFilteredCourses(filtered);
    }, [searchTerm, filterByEnrollment, filterByInstructor, sortOrder, groupBy, courses]);

    // Обработчик изменения фильтра по записи на курс
    const handleFilterByEnrollmentChange = (event) => {
        setFilterByEnrollment(event.target.checked);
    };

    // Обработчик изменения фильтра по преподавателю
    const handleFilterByInstructorChange = (event) => {
        setFilterByInstructor(event.target.value);
    };

    // Обработчик открытия модального окна для добавления курса
    const handleAddCourseClick = () => {
        setOpenAddCourseDialog(true);
    };

    // Обработчик закрытия модального окна
    const handleCloseAddCourseDialog = () => {
        setOpenAddCourseDialog(false);
        setNewCourseTitle('');
        setNewCourseDescription('');
    };

    // Обработчик сохранения нового курса
    const handleSaveCourse = async () => {
        if (newCourseTitle.trim() === '' || newCourseDescription.trim() === '') {
            alert('Название и описание курса не могут быть пустыми');
            return;
        }

        try {
            const response = await createCourse({
                title: newCourseTitle,
                description: newCourseDescription,
                genreId: genreId ? parseInt(genreId) : null, // Добавляем genreId, если он есть
            });
            setCourses([...courses, response.data]);
            setFilteredCourses([...filteredCourses, response.data]);
            setOpenAddCourseDialog(false);
            setNewCourseTitle('');
            setNewCourseDescription('');
        } catch (err) {
            setError('Ошибка при добавлении курса');
        }
    };

    // Получаем уникальных преподавателей для фильтра
    const uniqueInstructors = [...new Set(courses.map((course) => course.instructor.id))];

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Курсы
                </Typography>

                {/* Поиск, сортировка, фильтры и группировка */}
                <Box sx={{ width: '100%', maxWidth: 800, mb: 4 }}>
                    <Grid container spacing={2}>
                        {/* Поиск */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Поиск курсов..."
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
                        </Grid>

                        {/* Группировка */}
                        <Grid item xs={6} sm={3} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Группировать</InputLabel>
                                <Select
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    label="Группировать"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <GroupWorkIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="none">Нет</MenuItem>
                                    <MenuItem value="instructor">Преподавателю</MenuItem>
                                    <MenuItem value="genre">Жанру</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Фильтр по преподавателю */}
                        <Grid item xs={6} sm={3} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Преподаватель</InputLabel>
                                <Select
                                    value={filterByInstructor}
                                    onChange={handleFilterByInstructorChange}
                                    label="Преподаватель"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    {uniqueInstructors.map((instructorId) => {
                                        const instructor = courses.find((course) => course.instructor.id === instructorId)?.instructor;
                                        return (
                                            <MenuItem key={instructorId} value={instructorId}>
                                                {instructor?.fullName}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Сортировка */}
                        <Grid item xs={6} sm={3} md={2}>
                            <Tooltip title={sortOrder === 'asc' ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
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
                            </Tooltip>
                        </Grid>

                        {/* Фильтр по записи на курс */}
                        <Grid item xs={6} sm={3} md={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filterByEnrollment}
                                        onChange={handleFilterByEnrollmentChange}
                                        color="primary"
                                    />
                                }
                                label="Записанные"
                            />
                        </Grid>

                        {isTeacher() &&
                            <Grid item xs={6} sm={3} md={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddCourseClick}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                        color: '#fff',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                        },
                                    }}
                                >
                                    Добавить курс
                                </Button>
                            </Grid>
                        }
                        {/* Кнопка добавления курса */}
                    </Grid>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredCourses.map((course) => (
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
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body1">{course.description}</Typography>
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Преподаватель: {course.instructor.fullName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Жанр: {course.genre.name}
                                        </Typography>
                                        {course.isUserEnrolledInCourse && (
                                            <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
                                                Записан с {new Date(course.userEnrolledInCourseAt).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Модальное окно для добавления курса */}
            <Dialog open={openAddCourseDialog} onClose={handleCloseAddCourseDialog}>
                <DialogTitle>Добавить новый курс</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название курса"
                        type="text"
                        fullWidth
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Описание курса"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddCourseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveCourse} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CoursesScreen;