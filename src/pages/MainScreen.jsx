import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    Fade,
    InputAdornment,
    Modal, // Импорт компонента Modal
    Dialog, // Импорт компонента Dialog
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {createGenre, getAllGenres, isTeacher} from '../api/api'; // Импорт функции addGenre
import {
    Code as CodeIcon,
    Brush as BrushIcon,
    Store as StoreIcon,
    MusicNote as MusicNoteIcon,
    CameraAlt as CameraAltIcon,
    SportsEsports as SportsEsportsIcon,
    School as SchoolIcon,
    Science as ScienceIcon,
    FitnessCenter as FitnessCenterIcon,
    Language as LanguageIcon
} from '@mui/icons-material';

const icons = [
    CodeIcon,
    BrushIcon,
    StoreIcon,
    MusicNoteIcon,
    CameraAltIcon,
    SportsEsportsIcon,
    SchoolIcon,
    ScienceIcon,
    FitnessCenterIcon,
    LanguageIcon
];

const MainScreen = () => {
    const [genres, setGenres] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openAddGenreModal, setOpenAddGenreModal] = useState(false); // Состояние для модального окна
    const [newGenreName, setNewGenreName] = useState(''); // Состояние для названия нового жанра
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                getAllGenres().then(response => {
                    setGenres(response.data);
                    setFilteredGenres(response.data);
                    setLoading(false);
                });
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const filtered = genres.filter((genre) =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGenres(filtered);
    }, [searchTerm, genres]);

    const handleSort = () => {
        const sorted = [...filteredGenres].sort((a, b) => {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setFilteredGenres(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleGenreClick = (genreId) => {
        navigate(`/courses?genreId=${genreId}`);
    };

    const handleAddGenreClick = () => {
        setOpenAddGenreModal(true); // Открыть модальное окно
    };

    const handleCloseAddGenreModal = () => {
        setOpenAddGenreModal(false); // Закрыть модальное окно
        setNewGenreName(''); // Очистить поле ввода
    };

    const handleSaveGenre = async () => {
        if (newGenreName.trim() === '') {
            alert('Название жанра не может быть пустым');
            return;
        }

        try {
            const response = await createGenre(newGenreName);
            setGenres([...genres, response.data]);
            setFilteredGenres([...filteredGenres, response.data]);
            setOpenAddGenreModal(false);
            setNewGenreName('');
        } catch (err) {
            setError('Ошибка при добавлении жанра');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Выберите жанр
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 600, mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Поиск жанров..."
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
                            onClick={handleAddGenreClick}
                            startIcon={<AddIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                color: '#fff',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2575fc, #6a11cb)',
                                },
                            }}
                        >
                            Добавить жанр
                        </Button>
                    }
                </Box>

                {loading ? (
                    <Typography>Загрузка...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredGenres.map((genre, index) => {
                            const IconComponent = icons[index % icons.length];
                            return (
                                <Grid item key={genre.id} xs={12} sm={6} md={4}>
                                    <Fade in={true} timeout={500}>
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
                                            onClick={() => handleGenreClick(genre.id)}
                                        >
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                                    {genre.name}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* Модальное окно для добавления жанра */}
            <Dialog open={openAddGenreModal} onClose={handleCloseAddGenreModal}>
                <DialogTitle>Добавить новый жанр</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название жанра"
                        type="text"
                        fullWidth
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddGenreModal} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveGenre} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MainScreen;