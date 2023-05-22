// get musics from local storage
const get = () => {
    const musicValue = localStorage.getItem("musics");
    if (musicValue === undefined) {
        const musicCollection = { nextId: 1, musics: [] }
        return set(musicCollection);
    }
    const musicCollection = JSON.parse(musicValue);
    if (musicCollection === null) {
        const musicCollection = { nextId: 1, musics: [] }
        return set(musicCollection);
    }
    return musicCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const musicCollection = get();
    const musics = musicCollection.musics;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = musics.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `music with id ${id} not found` };
    }
    return { music: musics[index] };
}

// set musics in local storage
const set = (musicCollection) => {
    localStorage.setItem("musics", JSON.stringify(musicCollection));
    return musicCollection;
};

// add a music to local storage
const add = (music) => {
    const musicCollection = get();
    music = { ...music, id: musicCollection.nextId };
    musicCollection.nextId++;
    musicCollection.musics.push(music);
    set(musicCollection);
    return music;
};

// update a music in local storage
const update = (music) => {
    const musicCollection = get();

    const musics = musicCollection.musics;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = musics.findIndex((r) => r.id == music.id);
    if (index === -1) {
        return { "error": `music with id ${music.id} not found` };
    }
    musics[index] = music;
    set(musicCollection);
    return { musicCollection: musicCollection };
};

// delete a music from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const musicCollection = get();
    const musics = musicCollection.musics;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = musics.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `music with id ${id} not found` };
    }
    musics.splice(index, 1);
    set(musicCollection);
    return { musicCollection: musicCollection };
};

const musicUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { musicUtils };