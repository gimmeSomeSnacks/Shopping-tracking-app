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

        if (input !== addTagInput) {
            const newValue = input.value.trim();
            input.defaultValue = newValue;

            selects.forEach(select => {
                Array.from(select.options).forEach(option => {
                    if (('option' + input.id) === option.id) {
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
        const deleteId = event.target.getAttribute('id').replace('delete-', '');

        const tagInput = document.getElementById('input-' + deleteId);
        const tagContainer = tagInput.parentElement;

        document.querySelectorAll('select').forEach(select => {
            const option = document.getElementById('option' + tagInput.id);
            if (option) {
                option.remove();
            }
        });
        tagContainer.remove();
    }
    

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTag);
    });

    let selects = document.querySelectorAll('select');

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
    updateAllSelectOptions();

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

    const checksList = document.getElementById('checks');

    function checkDelete(event) {
        const target = event.target;
        if (target && target.tagName === 'SPAN' && target.textContent === 'Удалить') {
            const li = target.closest('li'); // Находим ближайший <li> элемент
            if (li) {
                li.remove(); // Удаляем <li> элемент
            }
        }
    }

    function checkAdd(event) {
        const target = event.target;
        if (target && target.tagName === 'SPAN' && target.parentElement.id === 'add-article') {
            const lis = Array.from(checksList.querySelectorAll('li')).filter(li => li.id.startsWith('check-'));

            const lastId = lis.reduce((max, li) => {
                const id = parseInt(li.id.replace('check-', ''), 10);
                return id > max ? id : max;
            }, 0);

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
                <input value="" id="check-expense-${newId}">
            `;
            newLi.appendChild(newSelect);

            const newDeleteButton = document.createElement('span');
            newDeleteButton.id = 'delete-check-' + newId;
            newDeleteButton.classList.add('delete-btn');
            newDeleteButton.textContent = 'Удалить';
            newDeleteButton.addEventListener('click', checkDelete);
            newLi.appendChild(newDeleteButton);

            const addArticleLi = checksList.querySelector('#add-article');
            if (addArticleLi) {
                checksList.insertBefore(newLi, addArticleLi);
            }
            // selects = document.querySelectorAll('select');
        }
    }
    checksList.addEventListener('click', checkDelete);

    const addArticleSpan = checksList.querySelector('#add-article span');
    if (addArticleSpan) {
        addArticleSpan.addEventListener('click', checkAdd);
    }

    function fillPage(pageJson) {
        let pageId = document.getElementById("pageId");
        pageId.textContent = pageJson.pageName;

        let expectedExpenses = document.getElementById("expectedExpenses");
        expectedExpenses.value = pageJson.expectedExpenses;

        const tagsContainer = document.getElementById('tags');
        tagsContainer.innerHTML = '';
        pageJson.tagList.forEach((tag, index) => {
            const div = document.createElement('div');
            div.classList.add('tag-container');

            const input = document.createElement('input');
            input.type = 'text';
            input.value = tag.name;
            input.id = `input-${index + 1}`;

            const deleteSpan = document.createElement('span');
            deleteSpan.classList.add('delete-btn');
            deleteSpan.id = `delete-${index + 1}`;
            deleteSpan.textContent = 'Удалить';

            div.appendChild(input);
            div.appendChild(deleteSpan);
            tagsContainer.appendChild(div);
        });

        const checksContainer = document.getElementById('checks');
        checksContainer.innerHTML = '';

        pageJson.checkList.forEach((check, index) => {
            const li = document.createElement('li');
            li.id = `check-${index + 1}`;

            const inputDescription = document.createElement('input');
            inputDescription.value = check.description;
            inputDescription.id = `check-text-${index + 1}`;

            const inputExpense = document.createElement('input');
            inputExpense.value = check.expense;
            inputExpense.id = `check-expense-${index + 1}`;

            const selectTag = document.createElement('select');
            selectTag.classList.add('check-tags');
            selectTag.id = `check-tag-${index + 1}`;

            // Заполняем select значениями тегов
            page.tagList.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag.id;
                option.textContent = tag.name;
                if (check.tag.id === tag.id) {
                    option.selected = true;
                }
                selectTag.appendChild(option);
            });

            const deleteSpan = document.createElement('span');
            deleteSpan.id = `delete-check-${index + 1}`;
            deleteSpan.textContent = 'Удалить';

            li.appendChild(inputDescription);
            li.appendChild(inputExpense);
            li.appendChild(selectTag);
            li.appendChild(deleteSpan);

            checksContainer.appendChild(li);
        });
    }
    getChecks();
});

function getSelectedDate() {
    const selectedElement = document.querySelector('.calendar-dates #selected');
    const day = parseInt(selectedElement.textContent, 10);
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
}

async function getChecks() {
    let pageId = document.getElementById('pageId').value;
    let date = getSelectedDate().toLocaleDateString('ru-RU');
    let findCheck = {
        pageId,
        date
    }

    let response = await fetch("http://localhost:8080/checks/date", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(findCheck)
    });
    if (!response.ok) {
        alert("Error");
        return;
    }
    return await response.json()
}







async function saveChanges() {
    let response = await fetch("http://localhost:8080/checks/save-changes", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
}