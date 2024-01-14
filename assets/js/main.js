const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pokemonData = await response.json();
        // Transforma os dados recebidos para o formato esperado
        console.log(pokemonData.types.map((typeEntry) => typeEntry.type.name));
        return {
            number: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types.map((typeEntry) => typeEntry.type.name),
            photo: pokemonData.sprites.front_default,
        };
    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
        return null; // Retorna null em caso de erro
    }
}

async function fetchPokemons(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data.results; // Retorna uma lista de pokémons
    } catch (error) {
        console.error("Erro ao buscar dados da PokeAPI:", error);
        return []; // Retorna uma lista vazia em caso de erro
    }
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.types[0]}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                        .map((type) => `<li class="type ${type}">${type}</li>`)
                        .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

async function loadPokemonItems(offset, limit) {
    try {
        const pokemonUrls = await fetchPokemons(offset, limit);
        const pokemonDetailsPromises = pokemonUrls.map((pokemon) =>
            fetchPokemonDetails(pokemon.url)
        );
        const pokemons = await Promise.all(pokemonDetailsPromises);

        const newHtml = pokemons
            .filter((pokemon) => pokemon !== null) // Filtra pokémons não encontrados
            .map(convertPokemonToLi)
            .join("");
        pokemonList.innerHTML += newHtml;
    } catch (error) {
        console.error("Erro ao carregar itens dos Pokémons:", error);
    }
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});
