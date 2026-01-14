let tg = window.Telegram.WebApp;
tg.expand();

const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const loader = document.getElementById('loader');

let foundBooks = [];

// Поиск по Enter
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchBooks();
  }
});

// Обработка клика (через слушатель - самый надежный вариант)
bookList.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-read')) {
        const index = event.target.getAttribute('data-index');
        handleBookSelect(index);
    }
});

async function searchBooks() {
    const query = searchInput.value;
    if (!query) return;

    bookList.innerHTML = '';
    loader.style.display = 'block';

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ru`);
        const data = await response.json();

        loader.style.display = 'none';

        if (!data.items) {
            bookList.innerHTML = '<div class="empty-state">Ничего не найдено 😔</div>';
            return;
        }

        foundBooks = data.items;

        const typeInputs = document.getElementsByName('book_type');
        let selectedType = "book";
        for (const input of typeInputs) {
            if (input.checked) selectedType = input.value;
        }
        const btnText = selectedType === 'audio' ? '🎧 Слушать' : '📖 Читать';

        foundBooks.forEach((item, index) => {
            const info = item.volumeInfo;
            
            let img = info.imageLinks?.thumbnail;
            if (img) img = img.replace("http://", "https://");
            else img = "https://via.placeholder.com/128x192.png?text=No+Cover";

            const desc = info.description || 'Описание отсутствует';
            const authors = info.authors ? info.authors.join(', ') : '';

            const card = document.createElement('div');
            card.className = 'book-card';
            
            card.innerHTML = `
                <img src="${img}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${info.title}</div>
                    <div class="book-author">${authors}</div>
                    <div class="book-desc">${desc}</div>
                    <button class="btn-read" data-index="${index}">${btnText}</button>
                </div>
            `;
            bookList.appendChild(card);
        });

    } catch (error) {
        loader.style.display = 'none';
        bookList.innerHTML = '<div class="empty-state">Ошибка сети.</div>';
    }
}

function handleBookSelect(index) {
    const book = foundBooks[index];
    if (!book) return;

    const typeInputs = document.getElementsByName('book_type');
    let selectedType = "book";
    for (const input of typeInputs) {
        if (input.checked) selectedType = input.value;
    }

    const data = JSON.stringify({
        action: "download_apk",
        book_title: book.volumeInfo.title,
        book_type: selectedType
    });
    
    tg.sendData(data);
    
    // 🔥 ВОТ ЭТО ИСПРАВИТ ПРОБЛЕМУ НА ПК 🔥
    setTimeout(() => {
        tg.close(); 
    }, 100); // Закрываем окно через 0.1 сек
}

function getInstruction() {
    tg.sendData(JSON.stringify({ action: "instruction" }));
    setTimeout(() => { tg.close(); }, 100);
}