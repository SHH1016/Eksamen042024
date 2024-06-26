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

      //spillet skal starte med indeks 0
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
      //samme index tall skal ikke pushes opp i randomPokeIndex
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
  opponentsAttack();
});
//Helsebaren for din pokemon og motstander sin pokemon
const healthBarContainer1 = document.querySelector(
  "#opponents-pokemons-healthbar"
);
healthBarContainer1.style.backgroundColor = "green";
healthBarContainer1.style.width = "200px";
healthBarContainer1.style.height = "50px";

const healthBarContainer2 = document.querySelector("#your-pokemon-healthbar");
healthBarContainer2.style.backgroundColor = "green";
healthBarContainer2.style.width = "200px";
healthBarContainer2.style.height = "50px";

async function attackOpponent() {
  try {
    //dine pokemon
    JSON.parse(sessionStorage.getItem("yourPokemon")) || [0];
    console.log(yourPokemon[0].stats[0].base_stat);
    let attackStat = parseInt(yourPokemon[0].stats[1].base_stat);
    console.log(attackStat);
    let healthStat = parseInt(yourPokemon[0].stats[0].base_stat);
    console.log(healthStat);

    //motstander pokemon
    JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [0];
    console.log(opponentsPokemon[0].stats[0].base_stat);
    let attackStatOpponent = parseInt(opponentsPokemon[0].stats[1].base_stat);
    console.log(attackStatOpponent);
    let healthStatOpponent = parseInt(opponentsPokemon[0].stats[0].base_stat);
    console.log(healthStatOpponent);

    //angrep
    let opponentsHealthWidth = parseInt(healthBarContainer1.style.width);
    console.log(opponentsHealthWidth + "px");

    if (opponentsHealthWidth > 0) {
      //healthbar motstander
      let newWidthHealth = (opponentsHealthWidth -= attackStat);
     console.log("opponents pokemon health",newWidthHealth + "px");
      healthBarContainer1.style.width = newWidthHealth + "px";

      //neste angrep om ikke pokemon sin helse er under eller 0
      let nextAttack = (newWidthHealth -= attackStat);
     

      if (opponentsHealthWidth <= 0 || opponentsHealthWidth < 0) {
        opponentsPokemon.shift();
        sessionStorage.setItem(
          "opponentsPokemon",
          JSON.stringify(opponentsPokemon)
        );
        console.log(opponentsPokemon);

        if (opponentsPokemon.length > 0) {
          JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [0];
          const opponentsPokemonNext = opponentsPokemon[0];
          await showOpponentPokemon(opponentsPokemonNext);
          healthBarContainer1.style.width = "200px";
        } else if (opponentsPokemon.length <= 0) {
          alert("Gratulerer du har vunnet!");
          fetchAllPokemon();
          //healthBarContainer1.style.width = "200px";
        }
      } else if (opponentsHealthWidth > 1) {
        nextAttack;
        healthBarContainer1.style.width = nextAttack - "px";
        //console.log("opponents pokemon new health",nextAttack +"px");
      }
    }
  } catch (error) {
    console.error("opps noe gikk galt i attackOpponent", error);
  }
}

async function opponentsAttack() {
  try {
    JSON.parse(sessionStorage.getItem("yourPokemon")) || [0];
    console.log(yourPokemon[0].stats[0].base_stat);
    let attackStat = parseInt(yourPokemon[0].stats[1].base_stat);
    console.log(attackStat);
    let healthStat = parseInt(yourPokemon[0].stats[0].base_stat);
    console.log(healthStat);

    JSON.parse(sessionStorage.getItem("opponentsPokemon")) || [0];
    console.log(opponentsPokemon[0].stats[0].base_stat);
    const attackStatOpponent = opponentsPokemon[0].stats[1].base_stat;
    console.log(attackStatOpponent);
    const healthStatOpponent = opponentsPokemon[0].stats[0].base_stat;
    console.log(healthStatOpponent);

    let yourHealthWidt = parseInt(healthBarContainer2.style.width);
    console.log(yourHealthWidt + "px");

    if (yourHealthWidt > 0) {
      //healthbar
      let newYourHealthWidth = (yourHealthWidt -= attackStatOpponent);
      console.log("your pokemon health",newYourHealthWidth + "px");
      healthBarContainer2.style.width = newYourHealthWidth + "px";

      //neste angrep om ikke pokemon sin helse ikke under eller 0
      let yourNextAttack = (newYourHealthWidth -= attackStatOpponent);
     

      if (yourHealthWidt <= 0 || yourHealthWidt < 0) {
        yourPokemon.shift();
        sessionStorage.setItem("yourPokemon", JSON.stringify(yourPokemon));
        console.log(yourPokemon);

        if (yourPokemon.length > 0) {
          JSON.parse(sessionStorage.getItem("")) || [0];
          const yourPokemonNext = yourPokemon[0];
          await showYourPokemon(yourPokemonNext);
          healthBarContainer2.style.width = "200px";
        } else if (yourPokemon.length <= 0) {
          alert("Dessverre ble det tap!");
          fetchAllPokemon();
          alert("refresh siden for å starte på nytt");
          //healthBarContainer2.style.width = "200px";
        }
      } else if (yourHealthWidt > 0) {
        yourNextAttack;
        healthBarContainer2.style.width = yourNextAttack - "px";
       // console.log("your pokemon new health",yourNextAttack +"px");
      }
    }
  } catch (error) {
    console.error("opps noe gikk galt i yourAttack", error);
  }
}
