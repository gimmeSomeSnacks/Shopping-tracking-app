function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}


document.addEventListener('DOMContentLoaded', function() {
    const tagsContainer = document.getElementById('tags');
    const addTagInput = document.getElementById('addTag');

    tagsContainer.addEventListener('dblclick', function(event) {
        if (event.target.tagName === 'INPUT' && event.target !== addTagInput) {
            event.target.removeAttribute('readonly');
            event.target.focus();
        }
    });

    tagsContainer.addEventListener('blur', function(event) {
        if (event.target.tagName === 'INPUT' && event.target !== addTagInput) {
            event.target.setAttribute('readonly', true);
        }
    }, true);

    tagsContainer.addEventListener('input', function(event) {
        const input = event.target;
        
        // Проверяем, что изменение произошло в input, который не "Добавить тег"
        if (input !== addTagInput) {
            const newValue = input.value.trim();
            input.defaultValue = newValue; // Обновляем defaultValue

            // Обновляем значение во всех select
            selects.forEach(select => {
                Array.from(select.options).forEach(option => {
                    if (('option' + input.id) == option.id) {
                        option.textContent = newValue;
                        option.value = newValue;
                    }
                });
            });
        }
    });

    addTagInput.addEventListener('focus', function() {
        if (this.value === 'Добавить тег') {
            this.value = '';
        }
    });

    addTagInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = 'Добавить тег';
        }
    });

    addTagInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const newTagValue = event.target.value.trim();
            if (newTagValue !== '') {
                uniqueId = generateUniqueId();

                const newTagInput = document.createElement('input');
                newTagInput.value = newTagValue;
                newTagInput.setAttribute('readonly', true);
                newTagInput.setAttribute('id', 'input-' + uniqueId);

                const newDeleteButton = document.createElement('span');
                newDeleteButton.classList.add('delete-btn');
                newDeleteButton.setAttribute('id', 'delete-' + uniqueId);
                newDeleteButton.textContent = 'Удалить';
                newDeleteButton.addEventListener('click', deleteTag);

                const newContainer = document.createElement('div');
                newContainer.classList.add('tag-container');
                newContainer.appendChild(newTagInput);
                newContainer.appendChild(newDeleteButton);
                tagsContainer.insertBefore(newContainer, addTagInput);

                selects.forEach(select => {
                    const option = document.createElement('option');
                    option.textContent = newTagValue;
                    option.setAttribute('id', 'option' + newTagInput.id);
                    select.appendChild(option);
                });

                event.target.value = 'Добавить тег';
            }
        }
    });

    function deleteTag(event) {
        // Получаем id для удаления из атрибута 'id' кнопки
        const deleteId = event.target.getAttribute('id').replace('delete-', '');
        
        // Находим input и его контейнер по id
        const tagInput = document.getElementById('input-' + deleteId);
        const tagContainer = tagInput.parentElement;
    
        // Удаляем опции из всех select
        document.querySelectorAll('select').forEach(select => {
            const option = document.getElementById('option' + tagInput.id);
            if (option) {
                option.remove();
            }
        });
    
        // Удаляем контейнер тега
        tagContainer.remove();
    }
    

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTag);
    });

    selects = document.querySelectorAll('select');

    // Функция для обновления всех select на странице
    function updateAllSelectOptions() {
        selects.forEach(select => {
            select.innerHTML = ''; // Очищаем текущие option

            // Перебираем все input в блоке tags
            tagsContainer.querySelectorAll('input').forEach(input => {
                if (input.value !== 'Добавить тег') { // Игнорируем input "Добавить тег"
                    const option = document.createElement('option');
                    option.textContent = input.value;
                    option.setAttribute('id', 'option' + input.id);
                    select.appendChild(option); // Добавляем новую option в текущий select
                }
            });
        });
    }

    // Вызываем функцию при загрузке страницы, чтобы заполнить все select изначальными значениями
    updateAllSelectOptions();

    // Календарь
    const calendarDates = document.getElementById('calendarDates');
    const currentMonth = document.getElementById('currentMonth');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    let date = new Date();
    let selectedDate = new Date(); // Устанавливаем текущую дату как выбранную по умолчанию

    function renderCalendar() {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        // Преобразование для русской локали (начало с понедельника)
        const startDay = (firstDay + 6) % 7;

        calendarDates.innerHTML = '';
        currentMonth.textContent = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        for (let i = startDay; i > 0; i--) {
            const prevDateElement = document.createElement('div');
            prevDateElement.classList.add('prev-date');
            prevDateElement.textContent = prevLastDate - i + 1;
            calendarDates.appendChild(prevDateElement);
        }

        for (let i = 1; i <= lastDate; i++) {
            const dateElement = document.createElement('div');
            dateElement.textContent = i;
            
            // Проверяем, соответствует ли текущая дата выбранной дате
            if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                dateElement.setAttribute('id', 'selected');
            }
            
            dateElement.addEventListener('click', function() {
                const previousSelected = document.querySelector('.calendar-dates #selected');
                if (previousSelected) {
                    previousSelected.removeAttribute('id');
                }
                dateElement.setAttribute('id', 'selected');
                selectedDate = new Date(year, month, i);
            });
            calendarDates.appendChild(dateElement);
        }
    }
    prevMonth.addEventListener('click', function() {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', function() {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    const checksList = document.getElementById('checks');

    // Функция для удаления элемента <li>
    function handleDelete(event) {
        const target = event.target;
        if (target && target.tagName === 'SPAN' && target.textContent === 'Удалить') {
            const li = target.closest('li'); // Находим ближайший <li> элемент
            if (li) {
                li.remove(); // Удаляем <li> элемент
            }
        }
    }

    // Функция для добавления нового элемента <li>
    function handleAdd(event) {
        const target = event.target;
        if (target && target.tagName === 'SPAN' && target.parentElement.id === 'add-article') {
            // Получаем все <li> элементы в списке
            const lis = Array.from(checksList.querySelectorAll('li')).filter(li => li.id.startsWith('check-'));

            // Находим последний идентификатор
            const lastId = lis.reduce((max, li) => {
                const id = parseInt(li.id.replace('check-', ''), 10);
                return id > max ? id : max;
            }, 0);

            // Создаем новый элемент <li> с уникальными идентификаторами
            const newId = generateUniqueId();
            const newLi = document.createElement('li');
            newLi.id = 'check-' + newId;

            const newSelect = document.createElement('select');
            newSelect.setAttribute('id', 'check-tag-' + newId);
            const inputs = tagsContainer.querySelectorAll('input');

            inputs.forEach(input => {
                if (input.value.trim() !== 'Добавить тег') {
                    const option = document.createElement('option');
                    option.textContent = input.value.trim();
                    option.value = input.value.trim();
                    option.setAttribute('id', 'optioninput-' + input.getAttribute('id').replace('input-', ''))
                    newSelect.appendChild(option);
                }
            });

            newLi.innerHTML = `
                <input value="" id="check-text-${newId}">
                <input value="" id="check-extense-${newId}">
            `;
            newLi.appendChild(newSelect);

            // Добавляем кнопку удаления
            const newDeleteButton = document.createElement('span');
            newDeleteButton.id = 'delete-' + newId;
            newDeleteButton.classList.add('delete-btn');
            newDeleteButton.textContent = 'Удалить';
            newDeleteButton.addEventListener('click', handleDelete);
            newLi.appendChild(newDeleteButton);

            // Вставляем новый <li> перед элементом "Добавить"
            const addArticleLi = checksList.querySelector('#add-article');
            if (addArticleLi) {
                checksList.insertBefore(newLi, addArticleLi);
            }
            selects = document.querySelectorAll('select');
        }
    }

    // Добавляем обработчик для всех существующих кнопок "Удалить"
    checksList.addEventListener('click', handleDelete);

    // Добавляем обработчик для кнопки "Добавить"
    const addArticleSpan = checksList.querySelector('#add-article span');
    if (addArticleSpan) {
        addArticleSpan.addEventListener('click', handleAdd);
    }
});