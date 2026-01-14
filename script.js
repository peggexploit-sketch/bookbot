let tg = window.Telegram.WebApp;
tg.expand();

const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const loader = document.getElementById('loader');

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

        // Проверяем, что выбрал юзер (Радиокнопка)
        const typeInputs = document.getElementsByName('book_type');
        let selectedType = "book";
        for (const input of typeInputs) {
            if (input.checked) selectedType = input.value;
        }
        
        // Меняем текст кнопки в зависимости от типа
        const btnText = selectedType === 'audio' ? '🎧 Слушать' : '📖 Читать';

        data.items.forEach(item => {
            const info = item.volumeInfo;

            let img = info.imageLinks?.thumbnail;
            if (img) {
                img = img.replace("http://", "https://");
            } else {
                img = "https://via.placeholder.com/128x192.png?text=No+Cover";
            }

            const desc = info.description || 'Описание отсутствует';
            const authors = info.authors ? info.authors.join(', ') : 'Неизвестный автор';
            const safeTitle = info.title.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <img src="${img}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${info.title}</div>
                    <div class="book-author">${authors}</div>
                    <div class="book-desc">${desc}</div>
                    <button class="btn-read" onclick="selectBook('${safeTitle}', '${selectedType}')">${btnText}</button>
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

function selectBook(title, type) {
    // Отправляем боту и название, и тип (аудио или книга)
    const data = JSON.stringify({
        action: "download_apk",
        book_title: title,
        book_type: type
    });
    tg.sendData(data);
}

function getInstruction() {
    // Просим бота показать инструкцию
    const data = JSON.stringify({
        action: "instruction"
    });
    tg.sendData(data);
}