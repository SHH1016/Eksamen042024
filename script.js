
let yourPokemon = [];
console.log(yourPokemon);

let opponentsPokemon = [];
console.log(opponentsPokemon);

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
      
      //random pokemin til yourPokemon Array
      const randomPokemonIndex = await makeRandomIndex(pokemonData.length, 3);
      console.log(randomPokemonIndex)

      randomPokemonIndex.forEach(index => {
        const randomPokemon = pokemonData[index];
        console.log(randomPokemon);
        if(randomPokemon){
            yourPokemon.push(randomPokemon); 
        }
      });
      //random pokemon til opponentsPokemon Array
      const randomPokemonIndex2 = await makeRandomIndex(pokemonData.length, 3);
      console.log(randomPokemonIndex2);

      randomPokemonIndex2.forEach(index =>{
        const randomPokemon2 = pokemonData[index];
        console.log(randomPokemon2);
        if(randomPokemon2){
            opponentsPokemon.push(randomPokemon2);
        }
      })

     
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

  