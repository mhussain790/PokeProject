const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");

const https = require("https");

// Declare Variables

const app = express();

const monsters = [];
const pokemonIMG = [];
const pokemonNum = 151;

var imageURL = "";
var pokemonName = "";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// GET + POST + LISTEN Requests

app.get("/", function (req, res) {

  // Fetch Pokemon determined by a set number (pokemonNum)
  const fetchPokemon = async () => {
    for (let i = 1; i <= pokemonNum; i++) {
      if (monsters.length < pokemonNum) {
        await getPokemon(i);
      }
    }
  };

  //API Call to PokeAPI
  const getPokemon = async (id) => {
    const url = "https://pokeapi.co/api/v2/pokemon/" + id;
    const response = await fetch(url);
    const newPokes = await response.json();
    createPokeObject(newPokes);
  };

  fetchPokemon();

  //Gets the name, ID #, and img sprites for each Pokemon and pushes the object into an array named Monsters
  function createPokeObject(newPokes) {
    const pokemon_name =
      newPokes.name[0].toUpperCase() + newPokes.name.slice(1);

    const attr_set = {
      name: pokemon_name,
      poke_id: newPokes.id,
      front_img: newPokes.sprites.front_default,
      back_img: newPokes.sprites.back_default,
    };

    monsters.push(attr_set);

    emptyArray(monsters);
    //console.log(pokemon_name);
  }

  const emptyArray = async (monsters) => {
    monsters = [];
  };

  // res.render("home", {monsters: monsters, pokemonName: monsters.name,imageSprite: monsters.front_img, pokemon_id: monsters.poke_id});

  // Only render the view once on page refresh
  var rendered = false;

  if (rendered == false && monsters.length == pokemonNum) {
    res.render("home", { monsters: monsters });
    rendered = true;
    emptyArray();

    console.log("Pokemon Rendered: " + pokemonNum);
    console.log("Has it rendered: " + rendered);
  }
});

app.listen(3000, function () {
  console.log("Server has started on Port:3000");
});
