// eslint-disable-next-line import/extensions
import { getPlaylists, deletePlaylist, updatePlaylist } from './api.js';

const CURRENT_USER_ID = 1;

const renderPlaylists = (playlists) => {
    const container = document.querySelector('.grid-container');
    container.innerHTML = ''; 

    playlists.forEach((playlist) => {
        const article = document.createElement('article');
        article.className = 'card';

        const badgeClass = playlist.is_public ? 'badge-public' : 'badge-private';
        const badgeText = playlist.is_public ? 'Public' : 'Private';
        const tracksCount = playlist.tracks ? playlist.tracks.length : 0;

        article.innerHTML = `
            <div class="card-header">
                <h3>${playlist.name}</h3>
                <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="card-body">
                <p>${tracksCount} tracks</p>
                <p>Owner ID: ${playlist.owner_id}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary edit-btn" data-id="${playlist.id}" data-public="${playlist.is_public}" data-owner="${playlist.owner_id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${playlist.id}">Delete</button>
            </div>
        `;
        container.appendChild(article);
    });

    // Логіка видалення
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            deletePlaylist(id, CURRENT_USER_ID).then(() => {
                getPlaylists().then(renderPlaylists);
            }).catch(() => {
                // eslint-disable-next-line no-param-reassign
                event.target.textContent = 'Error';
            });
        });
    });

    // Логіка редагування (НОВЕ)
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const id = parseInt(event.target.getAttribute('data-id'), 10);
            const isPublic = event.target.getAttribute('data-public') === 'true';
            const ownerId = parseInt(event.target.getAttribute('data-owner'), 10);

            const newName = prompt('Enter new playlist name:');
            if (newName) {
                const updatedData = {
                    id: id,
                    name: newName,
                    is_public: isPublic,
                    owner_id: ownerId,
                    tracks: []
                };

                updatePlaylist(id, updatedData, CURRENT_USER_ID).then(() => {
                    getPlaylists().then(renderPlaylists);
                }).catch(() => {
                    alert("You don't have permission to edit this playlist.");
                });
            }
        });
    });
};

window.addEventListener('DOMContentLoaded', () => {
    getPlaylists().then(renderPlaylists).catch(() => {
        const container = document.querySelector('.grid-container');
        container.innerHTML = '<p class="error-text">Failed to load playlists.</p>';
    });
});