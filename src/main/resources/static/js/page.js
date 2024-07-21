function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}


document.addEventListener('DOMContentLoaded', function() {

    const calendarDates = document.getElementById('calendarDates');
    const currentMonth = document.getElementById('currentMonth');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    let date = new Date();
    let selectedDate = new Date();

    function renderCalendar() {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

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
    
    // Функция для создания и добавления элемента тега
    function createTagElement(tagObject) {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');

        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.value = tagObject.name; // Используем свойство name из объекта Tag
        tagInput.setAttribute('id', tagObject.id);

        const deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', function() {
            tagContainer.remove(); // Удаление родительского контейнера (тега)
            updateCheckTagOptions();
        });
        tagInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                tagContainer.remove();
            }
            updateCheckTagOptions();
        });

        tagContainer.appendChild(tagInput);
        tagContainer.appendChild(deleteButton);

        return tagContainer;
    }

    // Функция для создания и добавления элемента проверки
    function createCheckElement(check) {
        const checkItem = document.createElement('li');
        checkItem.id = `check-${check.id}`; // Используем id из объекта Check

        const checkDescriptionInput = document.createElement('input');
        checkDescriptionInput.type = 'text';
        checkDescriptionInput.value = check.description; // Используем свойство description из объекта Check

        const checkExpenseInput = document.createElement('input');
        checkExpenseInput.type = 'text';
        checkExpenseInput.value = check.expense; // Используем свойство expense из объекта Check

        const checkTagSelect = document.createElement('select');
        
        // Получаем все теги из контейнера
        const tagInputs = document.querySelectorAll('#tags .tag-container input');
        tagInputs.forEach(tagInput => {
            if (tagInput.value != '') {
                const option = document.createElement('option');
                option.value = tagInput.value; // Используем значение input в качестве id
                option.textContent = tagInput.value; // Используем значение input в качестве текста
                if (tagInput.value === check.tag) {
                    option.selected = true; // Устанавливаем выбранный тег
                }
                checkTagSelect.appendChild(option);
            }
        });

        checkItem.appendChild(checkDescriptionInput);
        checkItem.appendChild(checkExpenseInput);
        checkItem.appendChild(checkTagSelect);
        
        const deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function() {
            checkItem.remove();
        });

        // Реализация удаления пока не нужна
        checkItem.appendChild(deleteButton);

        return checkItem;
    }

    // Функция для заполнения данных страницы из sessionStorage
    function populatePage() {
        // Получение данных из sessionStorage
        const pageData = JSON.parse(sessionStorage.getItem('pageData'));

        if (pageData) {
            // Заполнение имени страницы
            document.getElementById('pageId').value = pageData.pageName;
            document.getElementById('expectedExpenses').value = pageData.expectedExpenses;

            // Заполнение списка тегов
            const tagsContainer = document.getElementById('tags');
            pageData.tagList.forEach(tag => {
                tagObject = {
                    id: tag.id,
                    name: tag.name
                }
                const tagElement = createTagElement(tagObject);
                tagsContainer.insertBefore(tagElement, document.getElementById('addTag'));
            });

            // Заполнение списка проверок
            const checksContainer = document.getElementById('checks');
            pageData.checkList.forEach(check => {
                const checkElement = createCheckElement(check);
                checksContainer.insertBefore(checkElement, document.getElementById('add-article'));
            });
        }
    }
    populatePage();


    function handleAddTag() {
        const addTagInput = document.querySelector('#addTag input');
        
        // Функция для обработки потери фокуса или нажатия Enter
        function finalizeTag() {
            const tagName = addTagInput.value.trim();
            if (tagName) {
                const tagId = generateUniqueId();
                newTag = {
                    id: tagId,
                    name: tagName
                }
                const newTagElement = createTagElement(newTag);
                
                // Вставляем новый тег перед элементом "Добавить тег"
                const tagsContainer = document.getElementById('tags');
                tagsContainer.insertBefore(newTagElement, addTagInput.parentElement);
    
                // Очистка input и восстановление его в начальное состояние
                addTagInput.value = '';
                addTagInput.blur(); // Сброс фокуса
                updateCheckTagOptions();
            }
        }
    
        // Обработка потери фокуса
        addTagInput.addEventListener('blur', finalizeTag);
    
        // Обработка нажатия Enter
        addTagInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                finalizeTag();
            }
        });
    }
    handleAddTag();


    function handleAddCheck() {
        const addArticleElement = document.getElementById('add-article');
        
        addArticleElement.addEventListener('click', function() {
            const tagsContainer = document.getElementById('tags');
            const tagOptions = Array.from(tagsContainer.querySelectorAll('.tag-container'))
                .map(tagContainer => {
                    const input = tagContainer.querySelector('input');
                    return { id: input.id, name: input.value };
                });
            check = {
                id: generateUniqueId(),
                description: '',
                tag:  '',
                expense: ''
            }
            const newCheckElement = createCheckElement(check);
        
            const checksContainer = document.getElementById('checks');
            checksContainer.insertBefore(newCheckElement, addArticleElement);
        });
    }
    handleAddCheck();

    function updateCheckTagOptions() {
        const tagsContainer = document.getElementById('tags');
        const tagOptions = Array.from(tagsContainer.querySelectorAll('.tag-container input'))
            .filter(input => input.value.trim() !== '')
            .map(input => ({ id: input.id, name: input.value }));


        const checkElements = document.querySelectorAll('#checks li');
        checkElements.forEach(checkElement => {
            const select = checkElement.querySelector('select');
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '';

                tagOptions.forEach(tag => {
                    const option = document.createElement('option');
                    option.value = tag.id;
                    option.textContent = tag.name;
                    select.appendChild(option);
                });

                select.value = currentValue;
            }
        });
    }
});