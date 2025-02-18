let notes = JSON.parse(localStorage.getItem('notes')) || {};
let currentUser = '';

function login_btn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('user_email').innerText = email;
        document.getElementById('login_container').classList.add('hidden');
        document.getElementById('home_container').classList.remove('hidden');
        displayNotes();
    }
};

function logout() {
    currentUser = '';
    localStorage.removeItem('currentUser');
    document.getElementById('login_container').classList.remove('hidden');
    document.getElementById('home_container').classList.add('hidden');
};


function submitnotes() {
    const input = document.getElementById('input').value;
    const category = document.getElementById('category').value;
    const date = new Date().toLocaleString();
    if (input) {
        if (!notes[currentUser]) {
            notes[currentUser] = [];
        }
        notes[currentUser].push({ text: input, category: category, date: date });
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('input').value = '';
        displayNotes();
    }
};

function displayNotes() {
    const list = document.getElementById('list');
    list.innerHTML = '';
    const filterCategory = document.getElementById('filterCategory').value;
    const userNotes = (currentUser === 'admin@gmail.com') ? Object.values(notes).flat() : notes[currentUser] || [];

    const filteredNotes = filterCategory === 'all' ? userNotes : userNotes.filter(note => note.category === filterCategory);

    filteredNotes.forEach((note, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'text-white text-lg font-semibold border-b border-gray-700 p-2 flex justify-between items-center';
        listItem.innerHTML = `
                    <div>
                        <span>${note.text}</span> - <span class="italic">${note.category}</span>
                        <br>
                        <small>${note.date}</small>
                    </div>
                    <div>
                        <button onclick="editNotePrompt(${index})" class="text-yellow-500 mr-2">Edit</button>
                        <button onclick="deleteNote(${index})" class="text-red-600">Delete</button>
                    </div>
                `;
        list.appendChild(listItem);
    });
};

function editNotePrompt(index) {
    const newText = prompt("Enter new text:");
    if (newText) {
        if (currentUser === 'admin@gmail.com') {
            const allNotes = Object.entries(notes);
            let count = 0;
            for (let [user, userNotes] of allNotes) {
                if (count + userNotes.length > index) {
                    userNotes[index - count].text = newText;
                    break;
                }
                count += userNotes.length;
            }
        } else {
            notes[currentUser][index].text = newText;
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }
};

function deleteNote(index) {
    if (currentUser === 'admin@gmail.com') {
        const allNotes = Object.entries(notes);
        let count = 0;
        for (let [user, userNotes] of allNotes) {
            if (count + userNotes.length > index) {
                userNotes.splice(index - count, 1);
                break;
            }
            count += userNotes.length;
        }
    } else {
        notes[currentUser].splice(index, 1);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
};

function deleteAllNotes() {
    if (currentUser === 'admin@gmail.com') {
        notes = {};
    } else {
        delete notes[currentUser];
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
};

document.addEventListener('DOMContentLoaded', () => {
    currentUser = localStorage.getItem('currentUser') || '';
    if (currentUser) {
        document.getElementById('user_email').innerText = currentUser;
        document.getElementById('login_container').classList.add('hidden');
        document.getElementById('home_container').classList.remove('hidden');
        displayNotes();
    }
});