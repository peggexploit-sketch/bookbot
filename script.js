let tg = window.Telegram.WebApp;
tg.expand();

const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const loader = document.getElementById('loader');

// Поиск по нажатию Enter
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchBooks();
  }
});

async function searchBooks() {
    const query = searchInput.value;
    if (!query) return;

    // Очистка и лоадер
    bookList.innerHTML = '';
    loader.style.display = 'block';

    try {
        // Запрос к Google Books API
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ru`);
        const data = await response.json();

        loader.style.display = 'none';

        if (!data.items) {
            bookList.innerHTML = '<div class="empty-state">Ничего не найдено 😔</div>';
            return;
        }

        data.items.forEach(item => {
            const info = item.volumeInfo;

            // --- ИСПРАВЛЕНИЕ КАРТИНОК ---
            let img = info.imageLinks?.thumbnail;
            if (img) {
                // Меняем http на https принудительно
                img = img.replace("http://", "https://");
            } else {
                img = "https://via.placeholder.com/128x192.png?text=No+Cover";
            }
            // -----------------------------

            const desc = info.description || 'Описание отсутствует';
            const authors = info.authors ? info.authors.join(', ') : 'Неизвестный автор';
            // Экранируем кавычки в названии, чтобы не сломать кнопку
            const safeTitle = info.title.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <img src="${img}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${info.title}</div>
                    <div class="book-author">${authors}</div>
                    <div class="book-desc">${desc}</div>
                    <button class="btn-read" onclick="selectBook('${safeTitle}')">📖 Читать</button>
                </div>
            `;
            bookList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loader.style.display = 'none';
        bookList.innerHTML = '<div class="empty-state">Ошибка сети. Попробуйте позже.</div>';
    }
}

function selectBook(title) {
    // Отправляем боту название книги
    const data = JSON.stringify({
        action: "download_apk",
        book_title: title
    });
    tg.sendData(data);
}