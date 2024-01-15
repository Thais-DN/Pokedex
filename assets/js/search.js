// Definição da função fetchPokemonByName
// Busca um Pokémon pelo nome usando a PokeAPI
async function fetchPokemonByName(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados da PokeAPI:", error);
        return null; // Retorna null em caso de erro
    }
}

// Aguarda o carregamento completo da página e adiciona um evento de clique ao botão de pesquisa
window.onload = function () {
    const searchButton = document.getElementById("searchButton");
    const searchBox = document.getElementById("searchBox");

    if (searchButton && searchBox) {
        searchButton.addEventListener("click", async function () {
            var searchTerm = searchBox.value.trim();
            if (searchTerm) {
                const pokemon = await fetchPokemonByName(searchTerm);
                if (pokemon) {
                    displayPokemon(pokemon);
                } else {
                    console.log("Pokemon not found");
                    displayNotFound();
                }
            }
        });
    } else {
        console.error("Elemento(s) do DOM não encontrado(s).");
    }
};

function displayPokemon(pokemon) {
    clearPokemonList();
    const pokemonList = document.getElementById("pokemonList");

    // Prepara os dados do Pokémon para o formato esperado pela função convertPokemonToLi
    const pokemonData = {
        name: pokemon.name,
        number: pokemon.id, // Asumindo que o ID é o número do Pokémon
        types: pokemon.types.map((typeInfo) => typeInfo.type.name),
        photo: pokemon.sprites.front_default,
    };

    // Converte os dados do Pokémon em um item de lista formatado
    const listItemHTML = convertPokemonToLi(pokemonData);

    // Cria um novo elemento de lista e insere o HTML
    const listItem = document.createElement("li");
    listItem.innerHTML = listItemHTML;
    pokemonList.appendChild(listItem);
}

function convertPokemonToLi(pokemon) {
    // Sua função existente...
    return `
        <li class="pokemon ${pokemon.types[0]}">
            ... // Resto do código
    `;
}

// Função para limpar a lista de Pokémons
function clearPokemonList() {
    const pokemonList = document.getElementById("pokemonList");
    pokemonList.innerHTML = "";
}

// Função para exibir uma mensagem quando um Pokémon não é encontrado
function displayNotFound() {
    const pokemonList = document.getElementById("pokemonList");
    const listItem = document.createElement("li");
    listItem.textContent = "Pokemon not found.";
    pokemonList.appendChild(listItem);
}
