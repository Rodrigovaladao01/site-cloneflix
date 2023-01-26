function handler(e) {
    e.preventDefault();
    let movie = document.querySelector('.form__input').value;

    if (movie) {
        const _url = `http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.API_KEY}&t=${search}`;
        const _options = {
            method: 'Get',
            mode: 'cors',
            redirect: 'follow',
            cache: 'default',
        }
        fetch(_url, _options)
            .then(function (response) {
                if (!response.ok) throw new Error('Erro ao executar a requisição');
                return response.json();
            })
            .then(function (data) {
                let newContent = '';
                if (data.Response === "True") {
                    for (let i = 0; i < data.Search.length; i++) {
                        newContent += `<li class="app-movies-all__card" data-id="${data.Search[i].imdbID}">`;
                        newContent += `<figure class="app-movies-all__figure">`;
                        newContent += `<img class="app-movies-all__thumb"src="${data.Search[i].Poster}"/>`;
                        newContent += `</figure>`;
                        newContent += `<legend class="app-movies-all__legend">`;
                        newContent += `<span class="app-movies-all__year">${data.Search[i].Year}</span>`;
                        newContent += `<h2 class="app-movies-all__title">${data.Search[i].Title}</h2>`;
                        newContent += `</li>`;
                    }
                    document.getElementById('movies').innerHTML = newContent;
                } else {
                    document.getElementById('movies').innerHTML = "Nenhum conteúdo encontrado";
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

    function handleClick(e) {
        // Pegando o ID do filme a partir do atributo personalizado
        let movieId = e.currentTarget.getAttribute('data-id');
        if (movieId) {
            // Fazendo uma nova requisição com o ID do filme selecionado
            const _url = `http://www.omdbapi.com/?i=${movieId}&apikey=fc83b2cb&`;
            const _options = {
                method: 'Get',
                mode: 'cors',
                redirect: 'follow',
                cache: 'default',
            }
            fetch(_url, _options)
                .then(function (response) {
                    if (!response.ok) throw new Error('Erro ao executar a requisição');
                    return response.json();
                })
                .then(function (data) {
                    if (data.Response === "True") {
                        // Exibindo a sinopse do filme selecionado
                        console.log(data.Plot);
                    } else {
                        console.log("Nenhum conteúdo encontrado")
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}

window.onload = () => {
    const submit = document.querySelector('.form__submit');
    submit.addEventListener('click', handler);
}
