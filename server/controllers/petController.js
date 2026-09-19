import Pet from '../models/Pet.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const petPayload = (body) => ({
  name: body.name,
  species: body.species,
  breed: body.breed,
  age: body.age,
  gender: body.gender,
  description: body.description,
  personality: body.personality,
  location: body.location,
  image: body.image,
  vaccinated: body.vaccinated,
  status: body.status,
});

export const getPets = async (request, response, next) => {
  try {
    const { search, species, breed, gender, location, status, age, minAge, maxAge } = request.query;
    const filter = {};

    if (species) filter.species = new RegExp(`^${escapeRegex(species)}$`, 'i');
    if (breed) filter.breed = new RegExp(escapeRegex(breed), 'i');
    if (gender) filter.gender = new RegExp(`^${escapeRegex(gender)}$`, 'i');
    if (location) filter.location = new RegExp(escapeRegex(location), 'i');
    if (status) filter.status = new RegExp(`^${escapeRegex(status)}$`, 'i');

    const numericAge = Number(age);
    const numericMinAge = Number(minAge);
    const numericMaxAge = Number(maxAge);
    if (age !== undefined && Number.isFinite(numericAge)) filter.age = numericAge;
    if (minAge !== undefined && Number.isFinite(numericMinAge)) filter.age = { ...filter.age, $gte: numericMinAge };
    if (maxAge !== undefined && Number.isFinite(numericMaxAge)) filter.age = { ...filter.age, $lte: numericMaxAge };

    if (search?.trim()) {
      const searchPattern = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ name: searchPattern }, { breed: searchPattern }, { location: searchPattern }];
    }

    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    return response.status(200).json({ count: pets.length, pets });
  } catch (error) {
    return next(error);
  }
};

export const getPetById = async (request, response, next) => {
  try {
    const pet = await Pet.findById(request.params.id);
    if (!pet) return response.status(404).json({ message: 'Pet not found.' });
    return response.status(200).json({ pet });
  } catch (error) {
    return next(error);
  }
};

export const createPet = async (request, response, next) => {
  try {
    const pet = await Pet.create(petPayload(request.body));
    return response.status(201).json({ message: 'Pet added successfully.', pet });
  } catch (error) {
    return next(error);
  }
};

export const updatePet = async (request, response, next) => {
  try {
    const pet = await Pet.findByIdAndUpdate(request.params.id, petPayload(request.body), {
      new: true,
      runValidators: true,
    });
    if (!pet) return response.status(404).json({ message: 'Pet not found.' });
    return response.status(200).json({ message: 'Pet updated successfully.', pet });
  } catch (error) {
    return next(error);
  }
};

export const deletePet = async (request, response, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(request.params.id);
    if (!pet) return response.status(404).json({ message: 'Pet not found.' });
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};
