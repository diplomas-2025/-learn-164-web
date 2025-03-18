import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { getTestQuestions, submitTest } from '../api/api';

const TestScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: answerId }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Загрузка вопросов теста
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getTestQuestions(testId);
                setQuestions(response.data);
            } catch (err) {
                setError('Ошибка при загрузке вопросов теста');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [testId]);

    // Обработка выбора ответа
    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    // Отправка ответов на сервер
    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.keys(answers).map((questionId) => ({
                questionId: parseInt(questionId),
                answerId: answers[questionId],
            }));
            const result = await submitTest(testId, { answers: formattedAnswers });
            setResult(result.data);
        } catch (err) {
            setError('Ошибка при отправке ответов');
        }
    };

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

    if (result) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Результат теста
                </Typography>
                <Paper
                    elevation={6}
                    sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                        color: '#fff',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Тест: {result.test.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Пользователь: {result.user.fullName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Оценка: {result.score}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/course/${result.test.courseId}`)}
                        sx={{
                            mt: 2,
                            background: 'linear-gradient(135deg, #ff4081, #ff80ab)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #ff80ab, #ff4081)',
                            },
                        }}
                    >
                        Вернуться
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Прохождение теста
            </Typography>
            <List>
                {questions.map((question) => (
                    <Paper
                        key={question.id}
                        elevation={6}
                        sx={{
                            mb: 3,
                            p: 3,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                            color: '#fff',
                        }}
                    >
                        <ListItem>
                            <ListItemText
                                primary={question.text}
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                            />
                        </ListItem>
                        <RadioGroup
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        >
                            {question.answers.map((answer) => (
                                <FormControlLabel
                                    key={answer.id}
                                    value={answer.id}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={
                                        <Typography variant="body1" sx={{ color: '#fff' }}>
                                            {answer.text}
                                        </Typography>
                                    }
                                />
                            ))}
                        </RadioGroup>
                    </Paper>
                ))}
            </List>
            { Object.keys(answers).length === questions.length &&
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== questions.length}
                        sx={{
                            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                            },
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        Завершить тест
                    </Button>
                </Box>
            }
        </Container>
    );
};

export default TestScreen;