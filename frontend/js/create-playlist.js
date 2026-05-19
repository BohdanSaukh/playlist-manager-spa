// eslint-disable-next-line import/extensions
import { createPlaylist } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.custom-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('playlist_name').value;
        const visibilitySelect = document.getElementById('visibility').value;

        const newPlaylist = {
            id: Date.now(), // Тимчасова генерація унікального ID
            name: nameInput,
            is_public: visibilitySelect === 'public',
            owner_id: 1, // Mock current user
            tracks: [],
        };

        createPlaylist(newPlaylist).then(() => {
            window.location.href = 'playlists.html';
        }).catch(() => {
            const formSection = document.querySelector('.form-section');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'alert alert-danger';
            errorMsg.textContent = 'Failed to create playlist.';
            formSection.prepend(errorMsg);
        });
    });
});
