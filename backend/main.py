from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    id: int
    username: str
    role: str

class Playlist(BaseModel):
    id: int
    name: str
    is_public: bool
    owner_id: int
    tracks: List[str]

users_db = []
playlists_db = []

@app.post("/users", response_model = User)
def create_user(user: User):
    users_db.append(user)
    return user

@app.get("/playlists", response_model = List[Playlist])
def get_playlists():
    return playlists_db

@app.post("/playlists", response_model = Playlist)
def create_playlist(playlist: Playlist):
    playlists_db.append(playlist)
    return playlist

@app.put("/playlists/{playlist_id}", response_model = Playlist)
def update_playlist(playlist_id: int, updated_data: Playlist, current_user_id: int):
    for idx, p in enumerate(playlists_db):
        if p.id == playlist_id:
            if p.is_public == False and p.owner_id != current_user_id:
                raise HTTPException(status_code = 403, detail = "Forbidden")
            playlists_db[idx] = updated_data
            return updated_data
    raise HTTPException(status_code = 404, detail = "Not found")

@app.delete("/playlists/{playlist_id}")
def delete_playlist(playlist_id: int, current_user_id: int):
    for idx, p in enumerate(playlists_db):
        if p.id == playlist_id:
            if p.owner_id != current_user_id:
                raise HTTPException(status_code = 403, detail = "Forbidden")
            playlists_db.pop(idx)
            return {"status": "deleted"}
    raise HTTPException(status_code = 404, detail = "Not found")