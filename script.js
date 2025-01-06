let currentPokemonId = 1;
let randomInterval;
let isRandomOn = false;

// APIからポケモン情報を取得する関数
async function fetchPokemonData(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const speciesApiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    
    // ポケモン情報を取得
    const pokemonResponse = await fetch(apiUrl);
    const speciesResponse = await fetch(speciesApiUrl);

    if (!pokemonResponse.ok || !speciesResponse.ok) {
        alert("ポケモン情報が取得できませんでした。");
        return;
    }

    const pokemonData = await pokemonResponse.json();
    const speciesData = await speciesResponse.json();

    // 日本語名取得
    const jpName = await getJapaneseName(speciesData.names);

    // タイプ名取得
    const typeNames = {
        "grass": "くさ",
        "poison": "どく",
        "fire": "ほのお",
        "water": "みず",
        "electric": "でんき",
        "bug": "むし",
        "normal": "ノーマル",
        "fighting": "かくとう",
        "psychic": "エスパー",
        "ghost": "ゴースト",
        "dark": "あく",
        "fairy": "フェアリー",
        "dragon": "ドラゴン",
        "ice": "こおり",
        "rock": "いわ",
        "steel": "はがね",
        "flying": "ひこう",
        "ground": "じめん"
    };

    const types = pokemonData.types.map(typeInfo => typeNames[typeInfo.type.name]).join(" / ");
    
    document.getElementById("pokemon-id").textContent = `#${String(pokemonId).padStart(3, '0')}`;
    document.getElementById("pokemon-name").textContent = jpName;
    document.getElementById("pokemon-type").textContent = `たいぷ: ${types}`;
    document.getElementById("pokemon-height").textContent = `たかさ: ${pokemonData.height / 10} m`;
    document.getElementById("pokemon-weight").textContent = `おもさ: ${pokemonData.weight / 10} kg`;
    document.getElementById("pokemon-image").src = pokemonData.sprites.front_default || "https://via.placeholder.com/150";
}

// 日本語名を取得
async function getJapaneseName(names) {
    for (const nameInfo of names) {
        if (nameInfo.language.name === "ja-Hrkt") {
            return nameInfo.name;
        }
    }
    return "日本語名が見つかりません。";
}

// 初期表示
fetchPokemonData(currentPokemonId);

// 前のポケモン
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPokemonId === 1) {
        currentPokemonId = 1025; // 1番の時、最終番号1025に飛ぶ
    } else {
        currentPokemonId--;
    }
    fetchPokemonData(currentPokemonId);
});

// 次のポケモン
document.getElementById("next-button").addEventListener("click", () => {
    if (currentPokemonId < 1025) {
        currentPokemonId++;
        fetchPokemonData(currentPokemonId);
    }
});

// ランダム表示を切り替える関数
document.getElementById("toggle-random").addEventListener("click", () => {
    isRandomOn = !isRandomOn;
    const button = document.getElementById("toggle-random");

    if (isRandomOn) {
        button.classList.add("red");
        button.textContent = "ランダム表示ON";
        startRandomDisplay();
    } else {
        button.classList.remove("red");
        button.textContent = "ランダム表示OFF";
        stopRandomDisplay();
    }
});

// ランダム表示を開始する関数
function startRandomDisplay() {
    randomInterval = setInterval(() => {
        const randomId = Math.floor(Math.random() * 1024) + 1; // 1から1024の間でランダムなポケモンIDを生成
        fetchPokemonData(randomId);
    }, 13000); // 13秒ごとにランダムでポケモン表示
}

// ランダム表示を停止する関数
function stopRandomDisplay() {
    clearInterval(randomInterval);
}
