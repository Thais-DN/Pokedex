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

// Exemplo de uso
fetchPokemons(0, 10).then((pokemons) => console.log(pokemons));
