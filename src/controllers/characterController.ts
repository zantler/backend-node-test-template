import { Request, Response } from "express";
import { fetchCharacterByName } from "../services/rickAndMortyApi";
import { Character } from "../db/models";
import { Op } from "sequelize";

/**
 * Get characters by name with optional filters
 *
 * TODO: Implement this function to:
 * 1. Get characters by name from the database
 * 2. If not found in the database, fetch from the Rick & Morty API
 * 3. Save API results to the database
 * 4. Implement a cache system
 * 5. Support filtering by species and gender
 */

let lastQueryKey = "";
let lastQueryResult: any[] = [];

export const getCharacters = async (req: Request, res: Response) => {
  const { name, species, gender } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name parameter is required" });
  }

  // Cache check
  const key = `${name}|${species || ""}|${gender || ""}`;
  if (key === lastQueryKey && lastQueryResult) {
    console.log("cache hit");
    return res.json(lastQueryResult);
  }

  try {
    // Construcción dinámica del filtro
    const where: any = {
      name: { [Op.like]: `%${name}%` },
    };

    if (species && typeof species === "string") {
      where.species = species;
    }

    if (gender && typeof gender === "string") {
      where.gender = gender;
    }

    // Buscar en DB con filtros
    let characters = await Character.findAll({ where });
    console.log(`[DB] Found ${characters.length} character(s)`);

    // Si no hay resultados, ir a la API
    if (characters.length === 0) {
      console.log(`[API] Fetching from Rick & Morty API for name="${name}"`);
      const apiCharacters = await fetchCharacterByName(name);

      // Guardar/actualizar todos en la base de datos
      for (const char of apiCharacters) {
        await Character.upsert({
          id: char.id,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin?.name,
          location: char.location?.name,
          image: char.image,
          created: new Date(char.created),
        });
      }

      console.log(`[DB] Inserted ${apiCharacters.length} character(s)`);

      // Reintentar la búsqueda después de insertar
      characters = await Character.findAll({ where });
    }

    // Cachear el resultado final
    lastQueryKey = key;
    lastQueryResult = characters;

    return res.status(200).json(characters);
  } catch (error) {
    console.error("Error in /characters:", error);
    return res.status(500).json({ message: "Error: Internal server error" });
  }
};
