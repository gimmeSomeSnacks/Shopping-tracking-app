document.getElementById('addPageButton').addEventListener('click', function() {
    addNewPageInput();
});

async function getAllPages() {
    response = await fetch('/pages', {
        credentials: 'include',
        method: 'GET'
    });
    if (!response.ok) {
        alert('Error');
        return;
    }
    pages = response.JSON();
    pages.array.forEach(page => {
        listItem = document.createElement('li');
        input = document.createElement('input');
        input.type = 'text';
        finalizePageCreation(input, listItem);
    });
}

async function finalizePageCreation(input, listItem) {
    const pageName = input.value.trim();
    if (pageName) {
        const link = document.createElement('a');
        link.setAttribute('id', generateUniqueId());
        link.setAttribute('onclick', 'getPage(event)');
        link.href = '#';
        link.textContent = pageName;

        listItem.innerHTML = '';
        listItem.appendChild(link);

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', function() {
            enableEditing(listItem, pageName);
        });
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function() {
            deletePage(listItem);
        });
        listItem.appendChild(deleteButton);

        await fetch('/pages/add-page', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: pageName })
        });
    } else {
        listItem.remove();
    }
}

async function addNewPageInput() {
    const listContainer = document.getElementById('pageList');

    const listItem = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите название страницы...';

    listItem.appendChild(input);
    listContainer.appendChild(listItem);

    input.focus();

    input.addEventListener('blur', function() {
        finalizePageCreation(input, listItem);
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            input.blur();
        }
    });
}

async function enableEditing(listItem, oldPageName) {
    const link = listItem.querySelector('a');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldPageName;
    listItem.replaceChild(input, link);
    input.focus();

    input.addEventListener('blur', async function() {
        const newPageName = input.value.trim();
        if (newPageName !== oldPageName) {
            finalizePageCreation(input, listItem);
            page = {
                id: link.id,
                name: newPageName
            }

            id = link.id;
            await fetch(`/pages/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(page)
            });
        } else {
            finalizePageCreation(input, listItem);
        }
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            input.blur();
        }
    });
}

async function deletePage(listItem) {
    const link = listItem.querySelector('a');
    const id = link.id; 

    await fetch(`/pages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    listItem.remove();
}

async function getPage(event) {
    event.preventDefault();
    const pageId = event.target.id;
    
    const response = await fetch(`/pages/${pageId}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok){
        alert('Error');
        return;
    }
    const pageData = await response.json();

    sessionStorage.setItem('pageData', JSON.stringify(pageData));

    window.location.href = '/html/page.html';
}