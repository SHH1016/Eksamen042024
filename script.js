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
      displayAllPokemon(pokemonData);
    } catch (error) {
      console.error("Klarte ikke hente respons fra API", error);
    }
  }
  fetchAllPokemon();

  let yourPokemon;
  let opponentsPokemon;