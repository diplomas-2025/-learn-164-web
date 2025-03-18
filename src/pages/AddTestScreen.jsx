import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createTest } from '../api/api';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const AddTestScreen = () => {
    const { id } = useParams(); // ID темы
    const navigate = useNavigate();
    const [testTitle, setTestTitle] = useState('');
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            answers: [
                { answerText: '', isCorrect: false },
            ],
        },
    ]);

    // Обработчик изменения названия теста
    const handleTestTitleChange = (e) => {
        setTestTitle(e.target.value);
    };

    // Обработчик изменения текста вопроса
    const handleQuestionTextChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = e.target.value;
        setQuestions(newQuestions);
    };

    // Обработчик изменения текста ответа
    const handleAnswerTextChange = (questionIndex, answerIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].answerText = e.target.value;
        setQuestions(newQuestions);
    };

    // Обработчик изменения правильности ответа
    const handleAnswerCorrectChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].isCorrect =
            !newQuestions[questionIndex].answers[answerIndex].isCorrect;
        setQuestions(newQuestions);
    };

    // Добавление нового вопроса
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                answers: [
                    { answerText: '', isCorrect: false },
                ],
            },
        ]);
    };

    // Добавление нового ответа к вопросу
    const addAnswer = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.push({ answerText: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    // Удаление ответа
    const removeAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
    };

    // Удаление вопроса
    const removeQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(questionIndex, 1);
        setQuestions(newQuestions);
    };

    // Сохранение теста
    const handleSaveTest = async () => {
        try {
            await createTest(id, testTitle, questions);
            navigate(`/topics/${id}`); // Возвращаемся на страницу темы
        } catch (err) {
            console.error("Ошибка при создании теста:", err);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Добавить новый тест
                </Typography>

                {/* Поле для названия теста */}
                <TextField
                    fullWidth
                    label="Название теста"
                    value={testTitle}
                    onChange={handleTestTitleChange}
                    sx={{ mb: 4 }}
                />

                {/* Список вопросов */}
                {questions.map((question, questionIndex) => (
                    <Card key={questionIndex} sx={{ mb: 4, p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Вопрос {questionIndex + 1}
                            </Typography>
                            <IconButton onClick={() => removeQuestion(questionIndex)} color="error">
                                <RemoveIcon />
                            </IconButton>
                        </Box>

                        {/* Поле для текста вопроса */}
                        <TextField
                            fullWidth
                            label="Текст вопроса"
                            value={question.questionText}
                            onChange={(e) => handleQuestionTextChange(questionIndex, e)}
                            sx={{ mb: 2 }}
                        />

                        {/* Список ответов */}
                        {question.answers.map((answer, answerIndex) => (
                            <Box key={answerIndex} sx={{ mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={9}>
                                        <TextField
                                            fullWidth
                                            label={`Ответ ${answerIndex + 1}`}
                                            value={answer.answerText}
                                            onChange={(e) =>
                                                handleAnswerTextChange(questionIndex, answerIndex, e)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            fullWidth
                                            variant={answer.isCorrect ? 'contained' : 'outlined'}
                                            color={answer.isCorrect ? 'success' : 'primary'}
                                            onClick={() =>
                                                handleAnswerCorrectChange(questionIndex, answerIndex)
                                            }
                                        >
                                            {answer.isCorrect ? 'Правильный' : 'Неверный'}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <IconButton
                                            onClick={() => removeAnswer(questionIndex, answerIndex)}
                                            color="error"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}

                        {/* Кнопка добавления ответа */}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => addAnswer(questionIndex)}
                            sx={{ mt: 2 }}
                        >
                            Добавить ответ
                        </Button>
                    </Card>
                ))}

                {/* Кнопка добавления вопроса */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addQuestion}
                    sx={{ mt: 2 }}
                >
                    Добавить вопрос
                </Button>

                {/* Кнопка сохранения теста */}
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveTest}
                        sx={{ mr: 2 }}
                    >
                        Сохранить тест
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(`/topics/${id}`)}
                    >
                        Отмена
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddTestScreen;