window.addEventListener('DOMContentLoaded', async function getAllPages() {
    let response = await fetch('/pages', {
        credentials: 'include',
        method: 'GET'
    });
    if (!response.ok) {
        alert(response.status);
        return;
    }
    let pages = await response.json();

    pages.forEach(page => {
        let listItem = document.createElement('li');
        let input = document.createElement('input');
        input.id = page.id;
        input.type = 'text';
        input.value = page.pageName;
        finalizePageCreation(input, listItem);
    });
});

document.getElementById('addPageButton').addEventListener('click', async function addNewPageInput() {
    let listContainer = document.getElementById('pageList');
    let listItem = document.createElement('li');
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите название страницы...';

    let response = await fetch('/pages/add-page', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify("")
    });
    if (!response.ok) {
        alert(response.status);
        return;
    }

    let pageId = await response.json();
    input.setAttribute('id', pageId);

    listItem.appendChild(input);
    listContainer.appendChild(listItem);

    input.focus();

    input.addEventListener('blur', async function () {
        await finalizePageCreation(input, listItem);
    });

    input.addEventListener('input', async function () {
        let page = {
            id: input.id,
            pageName: input.value.trim()
        };
        let response = await fetch('/pages/edit', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        });
        if (!response.ok) {
            alert(response.status);
        }
    });
});

async function finalizePageCreation(input, listItem) {
    let pageName = input.value.trim();
    if (pageName) {
        let listContainer = document.getElementById('pageList');

        let link = document.createElement('a');
        link.setAttribute('id', input.id);
        link.setAttribute('onclick', `getPage(event)`);
        link.href = '#';
        link.textContent = pageName;

        listItem.innerHTML = '';
        listItem.appendChild(link);

        let editButton = document.createElement('button');
        editButton.textContent = String.fromCharCode(9998);
        editButton.className = 'button update';
        editButton.addEventListener('click', async function() {
            await enableEditing(listItem, input);
        });
        listItem.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = String.fromCharCode(10007);
        deleteButton.className = 'button delete';
        deleteButton.addEventListener('click', async function() {
            await deletePage(listItem);
        });
        listItem.appendChild(deleteButton);

        let underline = document.createElement('div');
        underline.className = 'underline';
        listItem.appendChild(underline);
        listContainer.appendChild(listItem);
    } else {
        await deletePage(listItem);
        listItem.remove();
    }
    input.remove();
}

async function enableEditing(listItem, oldInput) {
    let link = listItem.querySelector('a');
    let input = document.createElement('input');
    input.type = 'text';
    input.value = oldInput.value.trim();
    listItem.replaceChild(input, link);
    input.setAttribute('id', oldInput.id)
    input.focus();

    input.addEventListener('input', async function() {
        let newPageName = input.value.trim();
        let page = {
            id: link.id,
            pageName: newPageName
        };

        let response = await fetch(`/pages/edit`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        });
        if (!response.ok) {
            alert(response.status);
        }
    });

    // input.addEventListener('keydown', function(event) {
    //     if (event.key === 'Enter') {
    //         input.blur();
    //     }
    // });
    input.addEventListener('blur', async function () {
        await finalizePageCreation(input, listItem);
    });
}

async function deletePage(listItem) {
    if (listItem.id != '') {
        await fetch(`/pages/delete/${listItem.id}`, {
            method: 'GET',
            credentials: 'include'
        });
    }
    listItem.remove();
}

async function getPage(event) {
    event.preventDefault();
    let pageId = event.target.id;
    let date = new Date().toISOString().split('T')[0];

    let findCheckDto = {
        pageId: pageId,
        date: date
    };

    // sessionStorage.setItem('pageData', JSON.stringify(pageData));

    let tag = btoa(JSON.stringify(findCheckDto));
    window.location.href = `/page.html#${tag}`;
}