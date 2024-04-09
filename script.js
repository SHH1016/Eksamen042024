
let yourPokemon = [];
console.log(yourPokemon);

let opponentsPokemon = [];

let pokemonData = [];



async function fetchAllPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100"
      );
      const data = await response.json();

      const pokemons = data.results.map(async function (pokemon) {
        const response = await fetch(pokemon.url);
        return response.json();
      });
      pokemonData = await Promise.all(pokemons);
      console.log(pokemonData);
      
      const randomPokemonIndex = await makeRandomIndex(pokemonData.length, 3);
      console.log(randomPokemonIndex)

      randomPokemonIndex.forEach(index => {
        const randomPokemon = pokemonData[index];
        console.log(randomPokemon);
        if(randomPokemon){
            yourPokemon.push(randomPokemon);  
        }
      });
      
    } catch (error) {
      console.error("Klarte ikke hente respons fra API", error);
    }
  }
  fetchAllPokemon();

  async function makeRandomIndex(maxIndexLength, pokeNumberIndexes){
    try{
        //lager et nytt array som skal holde på random index
        //her måtte  jeg sjekke med chat gpt på hvordan jeg kunne fikse pokemonData[0] sin array index med en random
        const randomPokeIndexes = [];
        console.log(randomPokeIndexes);

        while(randomPokeIndexes.length < pokeNumberIndexes){
            const randomNumberIndex = Math.floor(Math.random()* maxIndexLength);
            if(!randomPokeIndexes.includes(randomNumberIndex)){
                randomPokeIndexes.push(randomNumberIndex);
            }
        } 
        return randomPokeIndexes;

    }catch(error){
        console.error("klarte ikke hente pokemon"),error;
    }
    
  }

  function randomLength(maxIndexLength){
    return Math.floor(Math.random()* maxIndexLength)
  }

  