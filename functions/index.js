const functions = require("firebase-functions");
const cors = require('cors')({origin: true});
const admin = require("firebase-admin");
const axios = require('axios');
admin.initializeApp();

exports.pokedex = functions.https.onRequest(async(request, response) => {
  cors(request, response, async () => {
    if (request.method === 'OPTIONS') {
      response.set('Access-Control-Allow-Origin', '*');
      response.set('Access-Control-Allow-Methods', 'GET, POST');
      response.set('Access-Control-Allow-Headers', 'Content-Type');
      response.status(204).send('');
    } else {
      try {
        const nombre = request.header('nombre');
        const pokesel = request.header('pokesel');
        const pokemonEndpoint = nombre;
        const PokeResponse = await axios.get(pokemonEndpoint);
        if (pokesel === 'false'){
          response.status(200).send(PokeResponse.data.results);
        } else {
          response.status(200).send(PokeResponse.data);
        };
      } catch (error) {
        console.error('Error:', error);
        response.status(500).send('Internal server error');
      };
    };
  });
});