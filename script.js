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
        // Запрос к Google Books API (БЕСПЛАТНО и ЛЕГАЛЬНО)
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ru`);
        const data = await response.json();

        loader.style.display = 'none';

        if (!data.items) {
            bookList.innerHTML = '<div class="empty-state">Ничего не найдено 😔</div>';
            return;
        }

        data.items.forEach(item => {
            const info = item.volumeInfo;
            // Заглушка, если нет картинки
            const img = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Cover';
            const desc = info.description || 'Описание отсутствует';
            const authors = info.authors ? info.authors.join(', ') : 'Неизвестный автор';

            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <img src="${img}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${info.title}</div>
                    <div class="book-author">${authors}</div>
                    <div class="book-desc">${desc}</div>
                    <button class="btn-read" onclick="selectBook('${info.title}')">📖 Читать</button>
                </div>
            `;
            bookList.appendChild(card);
        });

    } catch (error) {
        loader.style.display = 'none';
        bookList.innerHTML = '<div class="empty-state">Ошибка сети. Попробуйте позже.</div>';
    }
}

function selectBook(title) {
    // Отправляем боту название книги, которую выбрал юзер
    const data = JSON.stringify({
        action: "download_apk",
        book_title: title
    });
    tg.sendData(data);
}