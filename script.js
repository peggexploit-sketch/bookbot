let tg = window.Telegram.WebApp;
tg.expand();

const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const loader = document.getElementById('loader');

// Глобальная переменная для хранения найденных книг
let foundBooks = [];

// Поиск по Enter
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchBooks();
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

        // Сохраняем книги в глобальную переменную
        foundBooks = data.items;

        // Проверяем, какой тип выбран сейчас, чтобы нарисовать правильную кнопку
        const typeInputs = document.getElementsByName('book_type');
        let selectedType = "book";
        for (const input of typeInputs) {
            if (input.checked) selectedType = input.value;
        }
        const btnText = selectedType === 'audio' ? '🎧 Слушать' : '📖 Читать';

        // Генерируем список
        foundBooks.forEach((item, index) => {
            const info = item.volumeInfo;

            let img = info.imageLinks?.thumbnail;
            if (img) {
                img = img.replace("http://", "https://");
            } else {
                img = "https://via.placeholder.com/128x192.png?text=No+Cover";
            }

            const desc = info.description || 'Описание отсутствует';
            const authors = info.authors ? info.authors.join(', ') : 'Неизвестный автор';
            
            // ВАЖНО: В onclick мы теперь передаем просто INDEX (0, 1, 2...), а не текст
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <img src="${img}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${info.title}</div>
                    <div class="book-author">${authors}</div>
                    <div class="book-desc">${desc}</div>
                    <button class="btn-read" onclick="handleBookClick(${index})">${btnText}</button>
                </div>
            `;
            bookList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loader.style.display = 'none';
        bookList.innerHTML = '<div class="empty-state">Ошибка сети.</div>';
    }
}

// Новая функция обработки клика
function handleBookClick(index) {
    // 1. Берем книгу из памяти по индексу
    const book = foundBooks[index];
    if (!book) return;

    // 2. Проверяем, какой режим (Аудио/Книга) выбран ПРЯМО СЕЙЧАС
    const typeInputs = document.getElementsByName('book_type');
    let selectedType = "book";
    for (const input of typeInputs) {
        if (input.checked) selectedType = input.value;
    }

    // 3. Отправляем боту
    const data = JSON.stringify({
        action: "download_apk",
        book_title: book.volumeInfo.title,
        book_type: selectedType
    });
    tg.sendData(data);
}

function getInstruction() {
    const data = JSON.stringify({
        action: "instruction"
    });
    tg.sendData(data);
}