let yourPokemon = [];
console.log("Dine pokemons", yourPokemon);

let opponentsPokemon = [];
console.log("Motstander pokemons", opponentsPokemon);

let pokemonData = [];

let allPokemons;

//false/true basert på condtion
let updatePokemons = true;

async function fetchAllPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
    const data = await response.json();

    const pokemons = data.results.map(async function (pokemon) {
      const response = await fetch(pokemon.url);
      return response.json();
    });
    pokemonData = await Promise.all(pokemons);
    console.log(pokemonData);

    //random pokemon til yourPokemon Array
    const randomPokemonIndex = await makeRandomIndex(pokemonData.length, 3);
    console.log(randomPokemonIndex);

    sessionStorage.setItem(
      "PokemonInTheGame",
      JSON.stringify({ yourPokemon: [], opponentsPokemon: [] })
    );
    //let allPokemons = JSON.parse(sessionStorage.getItem("PokemonInTheGame"));

    JSON.parse(sessionStorage.getItem("yourPokemon")) || [];
    JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [];

    // while(!yourPokemon.length && !opponentsPokemon.length < 3){
    //satt den til når session storage har mottat 3 pokemons, skal den stoppe å oppdatere
    if (
      updatePokemons &&
      yourPokemon.length === 3 &&
      opponentsPokemon.length === 3
    ) {
      randomPokemonIndex.forEach((index) => {
        const randomPokemon = pokemonData[index];
        console.log(randomPokemon);
        if (randomPokemon) {
          yourPokemon.push(randomPokemon);
          //lagrer til sessionstorage
          //fikse så den kan hente inn nye pokemon på start og låse dem
        }
      });
      sessionStorage.setItem("yourPokemon", JSON.stringify(yourPokemon));

      //random pokemon til opponentsPokemon Array
      const randomPokemonIndex2 = await makeRandomIndex(pokemonData.length, 3);
      console.log(randomPokemonIndex2);

      randomPokemonIndex2.forEach((index) => {
        const randomPokemon2 = pokemonData[index];
        console.log(randomPokemon2);
        if (randomPokemon2) {
          opponentsPokemon.push(randomPokemon2);
          //lagrer til sessionstorage
        }
      });
      sessionStorage.setItem(
        "opponentsPokemon",
        JSON.stringify(opponentsPokemon)
      );
    }
    // setter en false på update den skal bli true når f.eks man skal starte nytt spill
    //men har satt pokemon lagret i session, da de byttes ut etter en tid
    updatePokemons = false;
  } catch (error) {
    console.error("Klarte ikke hente respons fra API", error);
  }
}
fetchAllPokemon();

async function makeRandomIndex(maxIndexLength, pokeNumberIndexes) {
  try {
    //lager et nytt array som skal holde på random index
    //her måtte  jeg sjekke med chat gpt på hvordan jeg kunne fikse pokemonData[0] sin array index med en random
    const randomPokeIndexes = [];
    console.log(randomPokeIndexes);

    while (randomPokeIndexes.length < pokeNumberIndexes) {
      const randomNumberIndex = Math.floor(Math.random() * maxIndexLength);
      if (!randomPokeIndexes.includes(randomNumberIndex)) {
        randomPokeIndexes.push(randomNumberIndex);
      }
    }
    return randomPokeIndexes;
  } catch (error) {
    console.error("klarte ikke hente pokemon"), error;
  }
}

//Display pokemons fra storage
async function showYourPokemon() {
  try {
    let yourPokemon = JSON.parse(sessionStorage.getItem("yourPokemon")) || [];

    const yourPokemonContainer = document.querySelector("#your-pokemons");
    yourPokemonContainer.innerHTML = "";

    yourPokemon.forEach(async function(pokemon){
        console.log(pokemon)

        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card");
        pokemonCard.style.width = "300px";

        const display = displayYourPokemons(pokemon,pokemonCard)

        pokemonCard.append(display)
        yourPokemonContainer.appendChild(pokemonCard)
    });
   
  } catch (error) {
    console.error("klarte ikke vise frem pokemon", error);
  }
}
showYourPokemon();

async function showOpponentPokemon(){
    try{
        let opponentsPokemon = JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [];
        const opponentsPokemonContainer = document.querySelector("#opponents-pokemons");
        opponentsPokemonContainer.innerHTML="";

            opponentsPokemon.forEach(async function(pokemon){
            console.log(pokemon)
    
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card");
            pokemonCard.style.width = "300px";
    
            const display = displayYourPokemons(pokemon,pokemonCard)
            //const health = pokemonHealth();
    
            pokemonCard.append(display)
            opponentsPokemonContainer.appendChild(pokemonCard)

            
        });

    }catch (error){
        console.error("klarte ikke vise motstander sine pokemon",error);
    }
}
showOpponentPokemon();

function displayYourPokemons(pokemon, pokemonCard) {

    const pokemonImage = document.createElement("img");
    pokemonImage.classList.add("pokemon-img");
    pokemonImage.src = pokemon.sprites.front_default;
    pokemonImage.style.width = "200px";

    const pokemonName = document.createElement("h3");
    pokemonName.classList.add("pokemon-name");
    pokemonName.textContent = `${pokemon.name}`;

    const pokemonAttack = document.createElement("h4");
    pokemonAttack.classList.add("pokemon-attack");
    pokemonAttack.textContent = `${pokemon.stats[1].stat.name} : ${pokemon.stats[1].base_stat}`;

    const healthBarContainer = document.createElement("div");
    healthBarContainer.style.backgroundColor = "green"
    healthBarContainer.style.width = "500px";
    healthBarContainer.style.height ="50px";

    pokemonCard.append(pokemonImage, pokemonName, pokemonAttack, healthBarContainer);
  
}
//Healthbar
function pokemonHealth (){

    const newHealth = 500;

    const healthBar = {
        stats:[[0].stat.name],
        stats:[[0].newHealth]
    }


}