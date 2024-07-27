function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}


document.addEventListener('DOMContentLoaded', function() {

    let calendarDates = document.getElementById('calendarDates');
    let currentMonth = document.getElementById('currentMonth');
    let prevMonth = document.getElementById('prevMonth');
    let nextMonth = document.getElementById('nextMonth');

    let date = new Date();
    let selectedDate = new Date();

    function renderCalendar() {
        let year = date.getFullYear();
        let month = date.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();
        let prevLastDate = new Date(year, month, 0).getDate();

        let startDay = (firstDay + 6) % 7;

        calendarDates.innerHTML = '';
        currentMonth.textContent = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        for (let i = startDay; i > 0; i--) {
            let prevDateElement = document.createElement('div');
            prevDateElement.classList.add('prev-date');
            prevDateElement.textContent = prevLastDate - i + 1;
            calendarDates.appendChild(prevDateElement);
        }

        for (let i = 1; i <= lastDate; i++) {
            let dateElement = document.createElement('div');
            dateElement.textContent = i;

            if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                dateElement.setAttribute('id', 'selected');
            }
            
            dateElement.addEventListener('click', function() {
                let previousSelected = document.querySelector('.calendar-dates #selected');
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

    async function createTagElement(tagObject) {
        let tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');

        let tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.value = tagObject.name; // Используем свойство name из объекта Tag
        tagInput.setAttribute('id', tagObject.id);

        let deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', async function() {
            tagContainer.remove(); // Удаление родительского контейнера (тега)
            updateCheckTagOptions();

            await fetch(`/check/delete/${tagObject.id}`, {
                method: 'POST',
                credentials: 'include'
            });
        });
        tagInput.addEventListener('blur', async function() {
            if (!this.value.trim()) {
                tagContainer.remove();
            }
            updateCheckTagOptions();
            let tag = {
                id: tagObject.id,
                name: this.value.trim()
            }
            await fetch(`/check/edit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tag)
            });
        });

        tagContainer.appendChild(tagInput);
        tagContainer.appendChild(deleteButton);

        return tagContainer;
    }

    async function createCheckElement(check) {
        let checkItem = document.createElement('li');
        checkItem.id = `check-${check.id}`;

        let checkDescriptionInput = document.createElement('input');
        checkDescriptionInput.type = 'text';
        checkDescriptionInput.value = check.description;

        let checkExpenseInput = document.createElement('input');
        checkExpenseInput.type = 'text';
        checkExpenseInput.value = check.expense;

        let checkTagSelect = document.createElement('select');

        let tagInputs = document.querySelectorAll('#tags .tag-container input');
        tagInputs.forEach(tagInput => {
            if (tagInput.value != '') {
                let option = document.createElement('option');
                option.value = tagInput.value;
                option.textContent = tagInput.value;
                if (tagInput.value === check.tag) {
                    option.selected = true;
                }
                checkTagSelect.appendChild(option);
            }
        });

        checkItem.appendChild(checkDescriptionInput);
        checkItem.appendChild(checkExpenseInput);
        checkItem.appendChild(checkTagSelect);
        
        let deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', async function() {
            checkItem.remove();

            await fetch(`/check/delete/${check.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        });

        let saveButton = document.createElement('span');
        saveButton.classList.add('save-btn');
        saveButton.textContent = 'Сохранить';
        saveButton.addEventListener('click', async function() {
            let saveCheck = {
                id: check.id,
                description: checkDescriptionInput.value,
                expense: checkExpenseInput.value,
                tag: checkTagSelect.value
            };

            // Отправка запроса на сохранение чека
            await fetch(`/check/save`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveCheck)
            });
        });

        checkItem.appendChild(deleteButton);
        checkItem.appendChild(saveButton);

        return checkItem;
    }

    function populatePage() {
        let pageData = JSON.parse(sessionStorage.getItem('pageData'));

        if (pageData) {
            // Заполнение имени страницы
            document.getElementById('pageId').value = pageData.pageName;
            document.getElementById('expectedExpenses').value = pageData.expectedExpenses;

            // Заполнение списка тегов
            let tagsContainer = document.getElementById('tags');
            pageData.tagList.forEach(tag => {
                tagObject = {
                    id: tag.id,
                    name: tag.name
                }
                let tagElement = createTagElement(tagObject);
                tagsContainer.insertBefore(tagElement, document.getElementById('addTag'));
            });

            // Заполнение списка проверок
            let checksContainer = document.getElementById('checks');
            pageData.checkList.forEach(check => {
                let checkElement = createCheckElement(check);
                checksContainer.insertBefore(checkElement, document.getElementById('add-article'));
            });
        }
    }
    populatePage();


    async function handleAddTag() {
        let addTagInput = document.querySelector('#addTag input');

        async function finalizeTag() {
            let tagName = addTagInput.value.trim();
            if (tagName) {
                let tagId = generateUniqueId();
                let newTag = {
                    id: tagId,
                    name: tagName
                }
                let newTagElement = createTagElement(newTag);

                let tagsContainer = document.getElementById('tags');
                tagsContainer.insertBefore(newTagElement, addTagInput.parentElement);

                addTagInput.value = '';
                addTagInput.blur();
                updateCheckTagOptions();

                await fetch('/add-tag', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTag)
                });
            }
        }
    
        addTagInput.addEventListener('blur', finalizeTag);

        addTagInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                finalizeTag();
            }
        });
    }
    handleAddTag();


    function handleAddCheck() {
        let addArticleElement = document.getElementById('add-article');
        
        addArticleElement.addEventListener('click', function() {
            let tagsContainer = document.getElementById('tags');
            let tagOptions = Array.from(tagsContainer.querySelectorAll('.tag-container'))
                .map(tagContainer => {
                    let input = tagContainer.querySelector('input');
                    return { id: input.id, name: input.value };
                });
            let check = {
                id: generateUniqueId(),
                description: '',
                tag:  '',
                expense: ''
            }

            let newCheckElement = createCheckElement(check);
            let checksContainer = document.getElementById('checks');
            checksContainer.insertBefore(newCheckElement, addArticleElement);
        });
    }
    handleAddCheck();

    function updateCheckTagOptions() {
        let tagsContainer = document.getElementById('tags');
        let tagOptions = Array.from(tagsContainer.querySelectorAll('.tag-container input'))
            .filter(input => input.value.trim() !== '')
            .map(input => ({ id: input.id, name: input.value }));


        let checkElements = document.querySelectorAll('#checks li');
        checkElements.forEach(checkElement => {
            let select = checkElement.querySelector('select');
            if (select) {
                let currentValue = select.value;
                select.innerHTML = '';

                tagOptions.forEach(tag => {
                    let option = document.createElement('option');
                    option.value = tag.id;
                    option.textContent = tag.name;
                    select.appendChild(option);
                });

                select.value = currentValue;
            }
        });
    }
});