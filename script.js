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

    sessionStorage.setItem("PokemonInTheGame", JSON.stringify({yourPokemon:[],opponentsPokemon:[]}))
    //let allPokemons = JSON.parse(sessionStorage.getItem("PokemonInTheGame"));

    JSON.parse(sessionStorage.getItem("yourPokemon")) || [];
    JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [];

   // while(!yourPokemon.length && !opponentsPokemon.length < 3){
    if(updatePokemons && yourPokemon.length && opponentsPokemon.length === 0){

        randomPokemonIndex.forEach((index) => {
            const randomPokemon = pokemonData[index];
            console.log(randomPokemon);
            if (randomPokemon) {

              yourPokemon.push(randomPokemon);
              //lagrer til sessionstorage
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
          sessionStorage.setItem("opponentsPokemon", JSON.stringify(opponentsPokemon));

          // setter en false på update den skal bli true når f.eks man skal starte nytt spill
          //men har satt pokemon lagret i session, da de byttes ut etter en tid
          updatePokemons = false;
    
    }
    
        
    

    

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
