// eslint-disable-next-line import/extensions
import { getPlaylists, deletePlaylist } from './api.js';

// Заглушка для ID поточного користувача
const CURRENT_USER_ID = 1;

const renderPlaylists = (playlists) => {
    const container = document.querySelector('.grid-container');
    container.innerHTML = ''; // Очищаємо статичний контент

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
                <button class="btn btn-danger delete-btn" data-id="${playlist.id}">Delete</button>
            </div>
        `;
        container.appendChild(article);
    });

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
};

window.addEventListener('DOMContentLoaded', () => {
    getPlaylists().then(renderPlaylists).catch(() => {
        const container = document.querySelector('.grid-container');
        container.innerHTML = '<p class="error-text">Failed to load playlists.</p>';
    });
});
