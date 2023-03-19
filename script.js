// Importando as bibliotecas necessárias
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

// Configurando o servidor Express
const app = express();
app.use(express.json());

// Conectando ao banco de dados MongoDB
mongoose.connect('mongodb+srv://rodrigo:<filmes123>@cluster10.v8elrhq.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao banco de dados');
}).catch((error) => {
    console.log('Erro ao conectar ao banco de dados:', error);
});

// Definindo o modelo do filme no banco de dados
const FilmeSchema = new mongoose.Schema({
    imdbID: { type: String, required: true },
    Title: { type: String, required: true },
    Year: { type: String, required: true },
    Poster: { type: String, required: true },
    Plot: { type: String },
});

const Filme = mongoose.model('Filme', FilmeSchema);

// Definindo a rota para buscar filmes
app.get('/filmes', async (req, res) => {
    try {
        // Buscando os filmes no banco de dados
        const filmes = await Filme.find();
        res.json(filmes);
    } catch (error) {
        console.log('Erro ao buscar filmes:', error);
        res.status(500).send('Erro ao buscar filmes');
    }
});

// Definindo a rota para buscar um filme específico
app.get('/filmes/:id', async (req, res) => {
    try {
        // Buscando o filme no banco de dados
        const filme = await Filme.findById(req.params.id);
        if (!filme) {
            return res.status(404).send('Filme não encontrado');
        }
        res.json(filme);
    } catch (error) {
        console.log('Erro ao buscar filme:', error);
        res.status(500).send('Erro ao buscar filme');
    }
});

// Definindo a rota para buscar filmes na API e armazenar no banco de dados
app.post('/filmes', async (req, res) => {
    try {
        // Fazendo a requisição na API
        const url = `http://www.omdbapi.com/?apikey=fc83b2cb&t&t=${req.body.title}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'False') {
            return res.status(404).send('Filme não encontrado na API');
        }

        // Salvando o filme no banco de dados
        const filme = await Filme.create({
            imdbID: data.imdbID,
            Title: data.Title,
            Year: data.Year,
            Poster: data.Poster,
            Plot: data.Plot,
        });
        res.json(filme);
    } catch (error) {
        console.log('Erro ao buscar filme na API:', error);
        res.status(500).send('Erro ao buscar filme na API');
    }
});

// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});


function saveMovie(movie) {
    db.collection('movies').add({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Plot: movie.Plot
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function handler(e) {
    e.preventDefault();
    let movieTitle = document.querySelector('.form__input').value;

    if (movieTitle) {
        db.collection('movies').where('Title', '==', movieTitle).get()
            .then(function (querySnapshot) {
                let newContent = '';
                querySnapshot.forEach(function (doc) {
                    let movie = doc.data();
                    newContent += `<li class="app-movies-all__card" data-id="${movie.imdbID}">`;
                    newContent += `<figure class="app-movies-all__figure">`;
                    newContent += `<img class="app-movies-all__thumb"src="${movie.Poster}"/>`;
                    newContent += `</figure>`;
                    newContent += `<legend class="app-movies-all__legend">`;
                    newContent += `<span class="app-movies-all__year">${movie.Year}</span>`;
                    newContent += `<h2 class="app-movies-all__title">${movie.Title}</h2>`;
                    newContent += `</li>`;
                });
                if (newContent === '') {
                    document.getElementById('movies').innerHTML = "Nenhum conteúdo encontrado";
                } else {
                    document.getElementById('movies').innerHTML = newContent;
                }
                // Adicionando evento de click para cada cartão de filme
                const movies = document.querySelectorAll('.app-movies-all__card');
                movies.forEach(movie => {
                    movie.addEventListener('click', handleClick);
                });
            })
            .catch(function (error) {
                console.log(error);
                document.getElementById('movies').innerHTML = "Nenhum conteúdo encontrado";
            });
    } else {
        alert('Digite o filme de sua escolha!');
    }
}

function handleClick(e) {
    // Pegando o ID do filme a partir do atributo personalizado
    let movieId = e.currentTarget.getAttribute('data-id');
    if (movieId) {
        // Fazendo uma nova requisição com o ID do filme selecionado
        db.collection('movies').doc(movieId).get()
            .then(function (doc) {
                if (doc.exists) {
                    let movie = doc.data();
                    // Exibindo a sinopse do filme selecionado
                    console.log(movie.Plot);
                } else {
                    console.log('Nenhum documento encontrado');
                }


            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function handleClick(e) {
    let movieId = e.currentTarget.getAttribute("data-id");
    if (movieId) {
        // Check if movie is in database
        db.get(
            "SELECT * FROM movies WHERE id = ?",
            [movieId],
            (err, row) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // If movie is in database, display plot
                if (row) {
                    console.log(row.plot);
                } else {
                    // If movie is not in database, make API request
                    const url = `http://www.omdbapi.com/?i=${movieId}&apikey=fc83b2cb&t&t`;
                    const options = {
                        method: "GET",
                        mode: "cors",
                        redirect: "follow",
                        cache: "default",
                    };

                    fetch(url, options)
                        .then((response) => {
                            if (!response.ok)
                                throw new Error("Erro ao executar a requisição");
                            return response.json();
                        })
                        .then((data) => {
                            if (data.Response === "True") {
                                // Insert movie into database
                                const { Title, Year, Poster, Plot, imdbRating } = data;
                                db.run(
                                    "INSERT INTO movies (id, title, year, poster_url, plot, rating) VALUES (?, ?, ?, ?, ?, ?)",
                                    [movieId, Title, Year, Poster, Plot, imdbRating],
                                    (err) => {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }

                                        console.log("Movie inserted into database");
                                    }
                                );

                                // Display plot
                                console.log(Plot);
                            } else {
                                console.log("Nenhum conteúdo encontrado");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            }
        );
    }
}


