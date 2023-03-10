// config inicial
const express = require('express')
const app = express()
require('dotenv').config()

// depois do db
const mongoose = require('mongoose')
const movie = require('./movie')


app.post('/search', async (req, res) => {
  const { search } = req.body

  // make the API call
  const _url = `http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.API_KEY}&t=${search}`;
  const _options = {
    method: 'Get',
    mode: 'cors',
    redirect: 'follow',
    cache: 'default',
  }
  const response = await fetch(_url, _options);
  const data = await response.json();

  //save the movie data to the database
  try {
    await movie.create(data);
    res.status(201).json({ message: 'Movie data saved to the database!' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


app.get('/movie/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const movie = await movie.findOne({ Title: title });
    if (!movie) {
      res.status(404).json({ message: 'Movie not found in the database!' });
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
