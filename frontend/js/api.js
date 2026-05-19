const API_BASE = 'http://localhost:8000';

export const getPlaylists = () => fetch(`${API_BASE}/playlists`)
    .then((res) => res.json());

export const createPlaylist = (playlistData) => fetch(`${API_BASE}/playlists`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(playlistData),
}).then((res) => res.json());

export const deletePlaylist = (playlistId, currentUserId) => fetch(`${API_BASE}/playlists/${playlistId}?current_user_id=${currentUserId}`, {
    method: 'DELETE',
}).then((res) => res.json());

export const updatePlaylist = (playlistId, playlistData, currentUserId) => fetch(`${API_BASE}/playlists/${playlistId}?current_user_id=${currentUserId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(playlistData),
}).then((res) => {
    if (!res.ok) throw new Error('Forbidden');
    return res.json();
});