let tg = window.Telegram.WebApp;
tg.expand(); // Растянуть на весь экран

// Список книг (для модерации - безобидная классика или популярное)
const books = [
    { id: 1, title: "Мастер и Маргарита", author: "Михаил Булгаков", icon: "🐈" },
    { id: 2, title: "Атомные привычки", author: "Джеймс Клир", icon: "🧠" },
    { id: 3, title: "Богатый папа, бедный папа", author: "Роберт Кийосаки", icon: "💰" },
    { id: 4, title: "1984", author: "Джордж Оруэлл", icon: "👁️" },
    { id: 5, title: "Шантарам", author: "Грегори Робертс", icon: "👳🏽‍♂️" }
];

const list = document.getElementById('bookList');

// Создаем карточки книг
books.forEach(book => {
    const item = document.createElement('div');
    item.className = 'book-card';
    item.innerHTML = `
        <div class="book-icon">${book.icon}</div>
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        </div>
        <button class="btn-read" onclick="selectBook(${book.id})">Читать</button>
    `;
    list.appendChild(item);
});

// Функция отправки данных боту
function selectBook(id) {
    // Мы отправляем боту команду, что юзер хочет "скачать"
    // Бот на сервере уже сам решит - дать APK или ссылку, в зависимости от режима
    const data = JSON.stringify({
        action: "download_apk",
        book_id: id
    });
    
    tg.sendData(data); // Отправка в Телеграм
    // tg.close(); // Можно закрыть окно, но лучше оставить
}