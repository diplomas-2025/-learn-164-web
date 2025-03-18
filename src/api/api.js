import axios from 'axios';

const API_BASE_URL = 'https://spotdiff.ru/learn-164-api';

// Создаем экземпляр Axios с базовым URL и настройками
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Регистрация нового пользователя
export const signUp = async (data) => {
    return api.post('/users/security/sign-up', data);
};

// Вход пользователя
export const signIn = async (data) => {
    return api.post('/users/security/sign-in', data);
};

// Получение всех тестов по topicId
export const getAllTests = async (topicId) => {
    return api.get('/api/tests', { params: { topicId } });
};

// Создание теста
export const createTest = async (topicId, title, questions) => {
    return api.post('/api/tests', questions, { params: { topicId, title } });
};

// Отправка ответов на тест
export const submitTest = async (testId, answers) => {
    return api.post(`/api/tests/${testId}/submit`, answers);
};

// Получение всех уроков по topicId
export const getLessons = async (topicId) => {
    return api.get('/api/lessons', { params: { topicId } });
};

// Создание урока
export const createLesson = async (data) => {
    return api.post('/api/lessons', data);
};

// Получение всех курсов
export const getAllCourses = async () => {
    return api.get('/api/courses');
};

// Создание курса
export const createCourse = async (data) => {
    return api.post('/api/courses', data);
};

// Получение всех тем по courseId
export const getAllTopics = async (courseId) => {
    return api.get('/api/courses/topics', { params: { courseId } });
};

// Создание темы
export const createTopic = async (data) => {
    return api.post('/api/courses/topics', data);
};

// Получение всех жанров
export const getAllGenres = async () => {
    return api.get('/api/courses/genres');
};

// Создание жанра
export const createGenre = async (name) => {
    return api.post('/api/courses/genres', name);
};

// Запись пользователя на курс
export const enrollUserToCourse = async (courseId) => {
    return api.post('/api/courses/enroll', null, { params: { courseId } });
};

// Получение информации о текущем пользователе
export const getCurrentUser = async () => {
    return api.get('/api/users/me');
};

// Получение вопросов теста по его ID
export const getTestQuestions = async (testId) => {
    return api.get(`/api/tests/${testId}/questions`);
};

// Получение всех результатов тестов
export const getTestResults = async () => {
    return api.get('/api/progress/test-results');
};

// Получение результатов тестов по topicId
export const getTestResultsByTopic = async (topicId) => {
    return api.get('/api/progress/test-results/topic', { params: { topicId } });
};

// Получение результата теста по его ID
export const getTestResultById = async (testId) => {
    return api.get(`/api/progress/test-results/by-test-id/${testId}`);
};

// Получение урока по его ID
export const getLessonById = async (lessonId) => {
    return api.get(`/api/lessons/${lessonId}`);
};

// Получение курса по его ID
export const getCourseById = async (courseId) => {
    return api.get(`/api/courses/${courseId}`);
};

// Получение всех курсов, на которые подписан пользователь
export const getCoursesEnrolledByUser = async () => {
    return api.get('/api/courses/enrollments');
};

// Проверка, подписан ли пользователь на курс
export const isUserEnrolledInCourse = async (courseId) => {
    return api.get('/api/courses/enrollments/check', { params: { courseId } });
};

export const isTeacher = () => {
    return localStorage.getItem("role") === 'INSTRUCTOR'
}

export default api;