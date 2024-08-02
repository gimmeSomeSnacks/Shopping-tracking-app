document.addEventListener('DOMContentLoaded', async function() {
    let calendarDates = document.getElementById('calendarDates');
    let currentMonth = document.getElementById('currentMonth');
    let prevMonth = document.getElementById('prevMonth');
    let nextMonth = document.getElementById('nextMonth');

    let date = new Date((JSON.parse(atob(location.hash.substring(1)))).date);
    let selectedDate = new Date((JSON.parse(atob(location.hash.substring(1)))).date);

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

            dateElement.addEventListener('click', async function() {
                let previousSelected = document.querySelector('.calendar-dates #selected');
                if (previousSelected) {
                    previousSelected.removeAttribute('id');
                }
                dateElement.setAttribute('id', 'selected');
                selectedDate = new Date(year, month, i + 1);
                tag.date = selectedDate.toISOString().split('T')[0];

                let checks = document.getElementById('checks');
                checks.innerHTML = '<li id = "add-article"><span>Добавить что-то</span></li>';
                document.getElementById('add-article').addEventListener('click', handleAddCheck);

                let tags = document.getElementById('tags');
                tags.innerHTML = '<div class="tag-container" id="addTag"><span>Добавить тег</span></div>'
                document.getElementById('addTag').addEventListener('click', finalizeTag);

                window.location.href = `/html/page.html#${btoa(JSON.stringify(tag))}`;
                await populatePage();
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


    let tag;
    let pageJson;
    async function  populatePage() {
        // let pageData = JSON.parse(sessionStorage.getItem('pageData'));
        let jsonData = atob(location.hash.substring(1));
        tag = JSON.parse(jsonData);
        if (!tag) {
            alert('Error');
        }
        let pageResponse = await  fetch(`/pages/${tag.pageId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!pageResponse.ok) {
            alert('Error');
        }
        pageJson = await pageResponse.json();
        if (pageJson) {
            let page = document.getElementById('pageId');
            page.value = pageJson.pageName;
            let expectedExpenses = document.getElementById('expectedExpenses');
            expectedExpenses.value = pageJson.expectedExpenses;
            expectedExpenses.addEventListener('input', async function() {
                let value = expectedExpenses.value;
                let response = await fetch('/page/expected-expenses', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: value
                });
                if (!response.ok) {
                    alert('Error');
                }
            })

            let tagsContainer = document.getElementById('tags');
            pageJson.tagList.forEach(tag => {
                let tagObject = {
                    id: tag.id,
                    name: tag.name
                }
                let tagElement = createTagElement(tagObject);
                tagsContainer.insertBefore(tagElement, document.getElementById('addTag'));
            });
        }

        let checksResponse = await fetch('/page/selected-date', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        if (!checksResponse.ok) {
            alert('Error');
        }
        let checksJson = await checksResponse.json();
        if (checksJson) {
            let checksContainer = document.getElementById('checks');
            checksJson.forEach(check => {
                let checkElement = finalizeCheckCreation(check);
                checksContainer.insertBefore(checkElement, document.getElementById('add-article'));
            });
        }
    }

    function createTagElement(tagObject) {
        let tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');

        let tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.value = tagObject.name;
        tagInput.setAttribute('id', tagObject.id);
        tagInput.addEventListener('input', async function () {
            let tagObject = {
                id: tagInput.id,
                name: tagInput.value
            }
            let response = await fetch (`/page/edit-tag`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tagObject)
            });
            if (!response.ok) {
                alert('Error');
            }
            updateCheckTagOptions();
        });

        let deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', deleteTag);

        async function deleteTag() {
            tagContainer.remove();
            updateCheckTagOptions();

            let response = await fetch(`/page/delete-tag/${tagObject.id}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                alert('Error');
            }
        }

        tagInput.addEventListener('blur', async function() {
            if (!this.value.trim()) {
                await deleteTag();
                updateCheckTagOptions();
            }
        });

        tagContainer.appendChild(tagInput);
        tagContainer.appendChild(deleteButton);
        return tagContainer;
    }

    async function sendEditCheck(checkId) {
        let checkDescription = document.getElementById(`check-description-${checkId}`);
        let checkExpense = document.getElementById(`check-expense-${checkId}`);
        let checkSelectOptions = document.querySelector(`#check-tag-select-${checkId}`);
        let checkTagSelect = checkSelectOptions.options[checkSelectOptions.selectedIndex];
        let check = {
            checkId: checkId,
            description: checkDescription.value,
            expense: checkExpense.value,
            tagId: checkTagSelect.id
        }
        let response = await fetch('/page/update-check', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(check)
        });
        if (!response) {
            alert('Error');
        }
    }

    function finalizeCheckCreation(check) {
        let checkItem = document.createElement('li');

        checkItem.id = `check-${check.id}`;

        let checkDescriptionInput = document.createElement('input');
        checkDescriptionInput.type = 'text';
        checkDescriptionInput.value = check.description;
        checkDescriptionInput.id = `check-description-${check.id}`

        let checkExpenseInput = document.createElement('input');
        checkExpenseInput.type = 'text';
        checkExpenseInput.value = check.expense;
        checkExpenseInput.id = `check-expense-${check.id}`

        let checkTagSelect = document.createElement('select');
        checkTagSelect.id = `check-tag-select-${check.id}`;

        let tagInputs = document.querySelectorAll('#tags .tag-container input');
        tagInputs.forEach(tagInput => {
            if (tagInput.value != '') {
                let option = document.createElement('option');
                option.id = tagInput.id;
                option.textContent = tagInput.value;
                if (tagInput.value === check.tag) {
                    option.selected = true;
                }
                checkTagSelect.appendChild(option);
            }
        });
        if (check.tag != null)
            checkTagSelect.value = check.tag.name;
        checkItem.appendChild(checkDescriptionInput);
        checkItem.appendChild(checkExpenseInput);
        checkItem.appendChild(checkTagSelect);

        checkDescriptionInput.addEventListener('input', async function() {
            await sendEditCheck(check.id);
        });
        checkTagSelect.addEventListener('change', async function() {
            await sendEditCheck(check.id);
        });
        checkExpenseInput.addEventListener('input', async function() {
            await sendEditCheck(check.id);
        });

        let deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', async function() {
            checkItem.remove();

            await fetch(`/check/delete-check/${check.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        });

        checkItem.appendChild(deleteButton);
        return checkItem;
    }

    async function finalizeTag() {
        let addTagInput = document.querySelector('#addTag span');
        let response = await fetch(`/page/add-tag/${pageJson.id}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            alert('Error');
        }
        let tagJson = await response.json();
        let newTag = {
            id: tagJson,
            name: ""
        }
        let newTagElement = await createTagElement(newTag);

        let tagsContainer = document.getElementById('tags');
        tagsContainer.insertBefore(newTagElement, addTagInput.parentElement);
        document.getElementById(tagJson).focus();
        addTagInput.value = '';
        addTagInput.blur();
        updateCheckTagOptions();
    }
    document.querySelector('#addTag').addEventListener('click', finalizeTag);

    async function handleAddCheck() {
        let addArticleElement = document.getElementById('add-article');
        // let tagsContainer = document.getElementById('tags');
        // let tagOptions = Array.from(tagsContainer.querySelectorAll('.tag-container'))
        //     .map(tagContainer => {
        //         let input = tagContainer.querySelector('input');
        //         if (input) {
        //             return { id: input.id, name: input.value };
        //         }
        //     });
        let newCheck = {
            pageId: pageJson.id,
            date: selectedDate,
            tagId: ""
        }
        let response = await fetch(`/page/add-check`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCheck)
        });
        if (!response.ok) {
            alert('Error');
        }
        newCheck.id = await response.json();
        let newCheckElement = finalizeCheckCreation(newCheck);
        let checksContainer = document.getElementById('checks');
        await checksContainer.insertBefore(await newCheckElement, addArticleElement);


    }
    document.getElementById('add-article').addEventListener('click', handleAddCheck);

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
                    option.id = tag.id;
                    option.textContent = tag.name;
                    select.appendChild(option);
                });

                select.value = currentValue;
            }
        });
    }
    renderCalendar();
    await populatePage();
});