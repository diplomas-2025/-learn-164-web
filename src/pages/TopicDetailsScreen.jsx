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
    List,
    ListItem,
    ListItemText,
    Link, DialogActions, DialogContent, Paper, IconButton, Avatar, DialogTitle, Dialog, TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getAllTests,
    getAllTopics,
    getLessons,
    getTestResultById,
    createTest,
    createLesson,
    isTeacher
} from "../api/api";
import { Quiz as TestIcon, Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';

const TopicDetailsScreen = () => {
    const { courseId, id } = useParams(); // Получаем ID темы из URL
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null); // Информация о теме
    const [lectures, setLectures] = useState([]); // Список лекций
    const [tests, setTests] = useState([]); // Список тестов
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [test, setTest] = useState(null);
    const [testResult, setTestResult] = useState(null);

    const [openAddLectureDialog, setOpenAddLectureDialog] = useState(false);
    const [openAddTestDialog, setOpenAddTestDialog] = useState(false);
    const [newLectureTitle, setNewLectureTitle] = useState('');
    const [newLectureFileUrl, setNewLectureFileUrl] = useState('');
    const [newTestTitle, setNewTestTitle] = useState('');
    const [newTestBody, setNewTestBody] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const topicResponse = await getAllTopics(courseId);
                const topics = topicResponse?.data || []; // Проверяем, что data есть

                if (!Array.isArray(topics)) {
                    throw new Error("Некорректный формат данных");
                }
                const selectedTopic = topics.find((topic) => topic.id == id);

                if (!selectedTopic) {
                    throw new Error("Тема не найдена");
                }

                const lecturesResponse = await getLessons(id);
                const testsResponse = await getAllTests(id);

                setTopic(selectedTopic);
                setLectures(lecturesResponse?.data || []);
                setTests(testsResponse?.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, id]);

    const handleClose = () => {
        setTest(null);
    };

    const handleOpenAddLectureDialog = () => {
        setOpenAddLectureDialog(true);
    };

    const handleCloseAddLectureDialog = () => {
        setOpenAddLectureDialog(false);
    };

    const handleOpenAddTestDialog = () => {
        setOpenAddTestDialog(true);
    };

    const handleCloseAddTestDialog = () => {
        setOpenAddTestDialog(false);
    };

    const handleSaveLecture = async () => {
        const lectureData = {
            title: newLectureTitle,
            fileUrl: newLectureFileUrl,
            topicId: id
        };
        try {
            await createLesson(lectureData);
            const lecturesResponse = await getLessons(id);
            setLectures(lecturesResponse?.data || []);
            handleCloseAddLectureDialog();
        } catch (err) {
            console.error("Ошибка при создании лекции:", err);
        }
    };

    const handleSaveTest = async () => {
        const testData = {
            topicId: id,
            title: newTestTitle,
            body: JSON.parse(newTestBody)
        };
        try {
            await createTest(testData);
            const testsResponse = await getAllTests(id);
            setTests(testsResponse?.data || []);
            handleCloseAddTestDialog();
        } catch (err) {
            console.error("Ошибка при создании теста:", err);
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
                {/* Информация о теме */}
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    {topic.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {topic.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Дата создания: {new Date(topic.createdAt).toLocaleDateString()}
                </Typography>

                {isTeacher() &&
                    <Button
                        onClick={() => navigate("/topics/" + id + "/result")}
                        sx={{
                            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                            },
                            mt: 2,
                            mb: 2
                        }}
                    >
                        Результаты
                    </Button>
                }

                {/* Список лекций */}
                <Box sx={{ mt: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                            Лекции
                        </Typography>
                        {isTeacher() &&
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddLectureDialog}
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                    },
                                }}
                            >
                                Добавить лекцию
                            </Button>
                        }
                    </Box>
                    <List>
                        {lectures.map((lecture) => (
                            <ListItem key={lecture.id} sx={{ borderBottom: '1px solid #eee' }}>
                                <ListItemText
                                    primary={lecture.title}
                                    secondary={
                                        <Link href={lecture.fileUrl} target="_blank" rel="noopener">
                                            Открыть лекцию
                                        </Link>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Список тестов */}
                <Box sx={{ mt: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                            Тесты
                        </Typography>
                        {isTeacher() &&
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate(`/topics/${id}/add-test`)} // Переход на страницу добавления теста
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                    },
                                }}
                            >
                                Добавить тест
                            </Button>
                        }
                    </Box>
                    <List>
                        {tests.map((test) => (
                            <ListItem key={test.id} sx={{ borderBottom: '1px solid #eee' }}>
                                <ListItemText
                                    primary={test.title}
                                    secondary={
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                getTestResultById(test.id)
                                                    .then((response) => {
                                                        setTestResult(response.data);
                                                        setTest(test);
                                                    })
                                                    .catch(() => {
                                                        setTest(test);
                                                    })
                                            }
                                            sx={{
                                                background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                                color: '#fff',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                                },
                                            }}
                                        >
                                            Пройти тест
                                        </Button>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>

            {/* Диалог для теста */}
            <Dialog
                open={test != null}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: 10,
                        minWidth: '450px',
                        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                        color: '#fff',
                        p: 2,
                    },
                }}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 2 }}>
                                <TestIcon sx={{ color: '#fff' }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                                {test ? test.title : ''}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleClose} size="small" sx={{ color: '#fff' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                {testResult &&
                    <DialogContent>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                            <Typography variant="body1" paragraph>
                                {test ? test.description : ''}
                            </Typography>
                            {testResult && (
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        p: 2,
                                        borderRadius: 3,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" color="#fff">
                                        Ваш результат: {testResult.score}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </DialogContent>
                }
                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                        onClick={handleClose}
                        color="secondary"
                        variant="outlined"
                        sx={{ borderRadius: 3, borderColor: '#fff', color: '#fff', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
                    >
                        Отмена
                    </Button>
                    <Button
                        disabled={!!testResult}
                        onClick={() => navigate(`/tests/${test.id}`)}
                        color="primary"
                        variant="contained"
                        sx={{ borderRadius: 3, bgcolor: '#fff', color: '#2575fc', '&:hover': { bgcolor: '#f0f0f0' } }}
                    >
                        Начать тест
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно для добавления лекции */}
            <Dialog open={openAddLectureDialog} onClose={handleCloseAddLectureDialog}>
                <DialogTitle>Добавить новую лекцию</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название лекции"
                        type="text"
                        fullWidth
                        value={newLectureTitle}
                        onChange={(e) => setNewLectureTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Ссылка"
                        type="text"
                        fullWidth
                        value={newLectureFileUrl}
                        onChange={(e) => setNewLectureFileUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddLectureDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveLecture} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TopicDetailsScreen;