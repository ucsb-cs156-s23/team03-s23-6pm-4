// get apartments from local storage
const get = () => {
    const apartmentValue = localStorage.getItem("apartments");
    if (apartmentValue === undefined) {
        const apartmentCollection = { nextId: 1, apartments: [] }
        return set(apartmentCollection);
    }
    const apartmentCollection = JSON.parse(apartmentValue);
    if (apartmentCollection === null) {
        const apartmentCollection = { nextId: 1, apartments: [] }
        return set(apartmentCollection);
    }
    return apartmentCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const apartmentCollection = get();
    const apartments = apartmentCollection.apartments;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = apartments.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `apartment with id ${id} not found` };
    }
    return { apartment: apartments[index] };
}

// set apartments in local storage
const set = (apartmentCollection) => {
    localStorage.setItem("apartments", JSON.stringify(apartmentCollection));
    return apartmentCollection;
};

// add a apartment to local storage
const add = (apartment) => {
    const apartmentCollection = get();
    apartment = { ...apartment, id: apartmentCollection.nextId };
    apartmentCollection.nextId++;
    apartmentCollection.apartments.push(apartment);
    set(apartmentCollection);
    return apartment;
};

// update a apartment in local storage
const update = (apartment) => {
    const apartmentCollection = get();

    const apartments = apartmentCollection.apartments;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = apartments.findIndex((r) => r.id == apartment.id);
    if (index === -1) {
        return { "error": `apartment with id ${apartment.id} not found` };
    }
    apartments[index] = apartment;
    set(apartmentCollection);
    return { apartmentCollection: apartmentCollection };
};

// delete a apartment from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const apartmentCollection = get();
    const apartments = apartmentCollection.apartments;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = apartments.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `apartment with id ${id} not found` };
    }
    apartments.splice(index, 1);
    set(apartmentCollection);
    return { apartmentCollection: apartmentCollection };
};

const apartmentUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { apartmentUtils };