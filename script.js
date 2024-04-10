let yourPokemon = [];
console.log("Dine pokemons", yourPokemon);

let opponentsPokemon = [];
console.log("Motstander pokemons", opponentsPokemon);

let pokemonData = [];

let allPokemons;

const startBtn = document.querySelector("#start-game");
const attackBtn = document.querySelector("#attack-btn");

//false/true basert på condtion
let updatePokemons = false;
console.log("updatePokemon", updatePokemons);
let pokemonSavedToSession = false;
console.log("SavedToSession", pokemonSavedToSession);

startBtn.addEventListener("click", function () {
  fetchAllPokemon();
});

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

    const setYourPokemon =
      JSON.parse(sessionStorage.getItem("yourPokemon")) || [];
    const setOpponentsPokemon =
      JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [];
    //Har måttet debugge mye chatgpt da det ikke funket som jeg tenkte og flyttet funksjon opp her
    if (setYourPokemon.length === 3 && setOpponentsPokemon.length === 3) {
      yourPokemon = setYourPokemon;
      opponentsPokemon = setOpponentsPokemon;

      const yourPokemonObject1 = yourPokemon[0];
      const opponentsPokemonObject1 = opponentsPokemon[0];

      showYourPokemon(yourPokemonObject1);
      showOpponentPokemon(opponentsPokemonObject1);

      pokemonSavedToSession = true;
      updatePokemons = false;
    } else if (!pokemonSavedToSession && updatePokemons) {
      yourPokemon = setYourPokemon;
      opponentsPokemon = setOpponentsPokemon;
    } else {
      //random pokemon til yourPokemon Array
      const randomPokemonIndex = await makeRandomIndex(pokemonData.length, 3);
      console.log(randomPokemonIndex);
      if (yourPokemon.length === 0) {
        randomPokemonIndex.forEach((index) => {
          const randomPokemon = pokemonData[index];
          console.log(randomPokemon);
          if (randomPokemon) {
            yourPokemon.push(randomPokemon);
            console.log(yourPokemon.length);
            sessionStorage.setItem("yourPokemon", JSON.stringify(yourPokemon));

            //lagrer til sessionstorage
            //fikse så den kan hente inn nye pokemon på start og låse dem
          }
        });
      }
      if (opponentsPokemon.length === 0) {
        //random pokemon til opponentsPokemon Array
        const randomPokemonIndex2 = await makeRandomIndex(
          pokemonData.length,
          3
        );
        console.log(randomPokemonIndex2);

        randomPokemonIndex2.forEach((index) => {
          const randomPokemon2 = pokemonData[index];
          console.log(randomPokemon2);
          if (randomPokemon2) {
            opponentsPokemon.push(randomPokemon2);
            //lagrer til sessionstorage
            console.log(opponentsPokemon.length);
            sessionStorage.setItem(
              "opponentsPokemon",
              JSON.stringify(opponentsPokemon)
            );
          }
        });
      }
      pokemonSavedToSession = true;
      updatePokemons = false;
    }

    // while(!yourPokemon.length && !opponentsPokemon.length < 3){
    //satt den til når session storage har mottat 3 pokemons, skal den stoppe å oppdatere
  } catch (error) {
    console.error("Klarte ikke hente respons fra API", error);
  }
}

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
async function showYourPokemon(index) {
  try {
    yourPokemon = JSON.parse(sessionStorage.getItem("yourPokemon")) || [index];
    const pokemon = index;
    console.log(pokemon);

    const yourPokemonContainer = document.querySelector("#your-pokemons");
    yourPokemonContainer.innerHTML = "";

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.style.width = "300px";

    const display = displayYourPokemons(pokemon, pokemonCard);
    /*
    const healthBarContainer = document.querySelector("#your-pokemon-healthbar");
    healthBarContainer.style.backgroundColor = "green";
    healthBarContainer.style.width = "500px";
    //updateHealth(healthBarContainer, pokemon);
    healthBarContainer.style.height = "50px";
    */
    const pokeHealth = 500;

    pokemonCard.append(display);
    yourPokemonContainer.appendChild(pokemonCard);
  } catch (error) {
    console.error("klarte ikke vise frem pokemon", error);
  }
}

async function showOpponentPokemon(index) {
  try {
    opponentsPokemon = JSON.parse(
      sessionStorage.getItem("opponentsPokemon")
    ) || [index];
    const pokemon = index;
    console.log(pokemon);

    const opponentsPokemonContainer = document.querySelector(
      "#opponents-pokemons"
    );
    opponentsPokemonContainer.innerHTML = "";

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.style.width = "300px";

    /*
    const healthBarContainer = document.querySelector("#opponents-pokemons-healthbar")
    healthBarContainer.style.backgroundColor = "green";
    healthBarContainer.style.width = "500px";
    //updateHealth(healthBarContainer, pokemon);
    healthBarContainer.style.height = "50px";
    */
    const pokeHealth = 500;

    const display = displayYourPokemons(pokemon, pokemonCard);

    pokemonCard.append(display);
    opponentsPokemonContainer.appendChild(pokemonCard);
  } catch (error) {
    console.error("klarte ikke vise motstander sine pokemon", error);
  }
}

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

  const healtBarName = document.createElement("h4");
  healtBarName.textContent = `${pokemon.stats[0].stat.name}:${pokemon.stats[0].base_stat}`;
  const healthBarText = document.createElement("h4");
  const healthTxt = 500;
  healthBarText.textContent = `${healthTxt}`;

  pokemonCard.append(pokemonImage, pokemonName, pokemonAttack, healtBarName);
}

attackBtn.addEventListener("click", function () {
  attackOpponent();
});
//Helsebaren for din pokemon og motstander sin pokemon
const healthBarContainer1 = document.querySelector(
  "#opponents-pokemons-healthbar"
);
healthBarContainer1.style.backgroundColor = "green";
healthBarContainer1.style.width = "200px";
//updateHealth(healthBarContainer, pokemon);
healthBarContainer1.style.height = "50px";

const healthBarContainer2 = document.querySelector("#your-pokemon-healthbar");
healthBarContainer2.style.backgroundColor = "green";
healthBarContainer2.style.width = "200px";
//updateHealth(healthBarContainer, pokemon);
healthBarContainer2.style.height = "50px";

async function attackOpponent() {
  try {
    //dine pokemon
    JSON.parse(sessionStorage.getItem("yourPokemon")) || [0];
        console.log(yourPokemon[0].stats[0].base_stat);
        let attackStat = parseInt(yourPokemon[0].stats[1].base_stat);
        console.log(attackStat)
        let healthStat = parseInt(yourPokemon[0].stats[0].base_stat);
        console.log(healthStat);

    //motstander pokemon
    JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [0];
        console.log(opponentsPokemon[0].stats[0].base_stat)
        let attackStatOpponent = parseInt(opponentsPokemon[0].stats[1].base_stat);
        console.log(attackStatOpponent)
        let healthStatOpponent = parseInt(opponentsPokemon[0].stats[0].base_stat);
        console.log(healthStatOpponent);

    //angrep
    if(healthStat < 0){

        let newHealt = healthStatOpponent -= attackStat;
        console.log(newHealt)

        if(newHealt <= 0){
            opponentsPokemon.shift();
            sessionStorage.setItem("opponentsPokemon",JSON.stringify(opponentsPokemon))
            console.log(opponentsPokemon);
    
            if(yourPokemon.length > 0){
                const opponentsPokemonNext = opponentsPokemon[0];
                await showOpponentPokemon(opponentsPokemonNext);
            }else{
                alert("Gratulerer du har vunnet!");
            }

         }
   
    }
    //else{///condtion på hvis pokemon har blitt angrepet tilbake }

   // await opponentsAttack()
  } catch (error) {
    console.error("opps noe gikk galt i attackOpponent", error);
  }
}

async function opponentsAttack() {
    try{
        JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [0];
        console.log(opponentsPokemon[0].stats[0].base_stat)
        const attackStatOpponent = opponentsPokemon[0].stats[1].base_stat;
        console.log(attackStatOpponent)
        const healthStatOpponent = opponentsPokemon[0].stats[0].base_stat;
        console.log(healthStatOpponent);

    }catch(error){
        console.error("opps noe gikk galt i opponentsAttack",error)

    }
}

    