    const audio = document.getElementById('background-music');
    audio.volume = 0.4;
    audio.play().catch(error => {
        console.error('Error trying to play the audio:', error);
    });


const unicodeMap = {
    "a": "а", "c": "с", "d": "ԁ", "e": "е", "i": "і",
    "j": "ј", "o": "ο", "p": "р", "q": "ԛ", "s": "ѕ",
    "w": "ԝ", "x": "х", "y": "у", "A": "Α", "B": "Β",
    "C": "С", "E": "Ε", "H": "Η", "I": "Ι", "J": "Ј",
    "K": "Κ", "M": "Μ", "N": "Ν", "O": "Ο", "P": "Ρ",
    "S": "Ѕ", "T": "Τ", "X": "Χ", "Y": "Υ", "Z": "Ζ"
};

function generateVariations() {
    const word = document.getElementById('wordInput').value;
    const variationsList = document.getElementById('variationsList');
    const saveOption = document.getElementById('saveOption');

    variationsList.innerHTML = '';

    if (word.trim() === '') {
        alert("Please enter a word.");
        return;
    }

    const variations = getVariations(word);
    if (variations.length > 0) {
        variations.forEach(variation => {
            const li = document.createElement('li');
            li.innerHTML = highlightUnicode(word, variation);
            variationsList.appendChild(li);
        });
        saveOption.style.display = 'block';
    } else {
        variationsList.innerHTML = '<li>No variations found for this word.</li>';
        saveOption.style.display = 'none';
    }

    adjustZoom();
}

function getVariations(word) {
    const replaceablePositions = Array.from(word).map((char, i) => [i, unicodeMap[char]]).filter(([, replacement]) => replacement);
    const variations = new Set();

    for (let r = 1; r <= replaceablePositions.length; r++) {
        const combos = combinations(replaceablePositions, r);
        combos.forEach(combo => {
            const newWord = Array.from(word);
            combo.forEach(([pos, replacement]) => {
                newWord[pos] = replacement;
            });
            variations.add(newWord.join(''));
        });
    }

    return Array.from(variations).sort();
}

function combinations(arr, r) {
    if (r > arr.length || r <= 0) return [];
    if (r === arr.length) return [arr];
    if (r === 1) return arr.map(e => [e]);

    return arr.flatMap((e, i) =>
        combinations(arr.slice(i + 1), r - 1).map(c => [e, ...c])
    );
}

function highlightUnicode(original, variation) {
    return Array.from(original).map((char, i) =>
        unicodeMap[char] === variation[i] ? `<span style="color: #4DB6AC;">${variation[i]}</span>` : variation[i]
    ).join('');
}

function saveVariations() {
    const word = document.getElementById('wordInput').value;
    const variations = Array.from(document.getElementById('variationsList').children).map(li => li.textContent);
    const blob = new Blob([variations.join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${word}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    alert(`Saved ${variations.length} variations to ${word}.txt`);
}

function adjustZoom() {
    const container = document.querySelector('.container');
    const containerHeight = container.scrollHeight;
    const viewportHeight = window.innerHeight;

    if (containerHeight > viewportHeight) {
        const zoomLevel = viewportHeight / containerHeight;
        document.body.style.zoom = zoomLevel;
    } else {
        document.body.style.zoom = 1;
    }
}
