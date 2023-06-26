import { FIGHTER } from "../models/fighter.js";
import { USER } from "../models/user.js";
import { userRepository } from "../repositories/userRepository.js";
import { fighterRepository } from "../repositories/fighterRepository.js";

const createFighterValid = (req, res, next) => {
  const data = {};
  try {
    validate(req.body, data, "create");
    req.data = data;
  } catch (e) {
    req.err = e;
  }
  next();
};

const updateFighterValid = (req, res, next) => {
  const data = {};
  if (!req.params.id) {
    req.err = { message: "Need Id" };
    return next();
  }

  const user = fighterRepository.getOne({ id: req.params.id });
  if (!user) {
    req.err = { message: "User not found", status: 404 };
    return next();
  }

  try {
    validate(req.body, data);
    if (!Object.keys(data).length) {
      req.err = { message: "Invalid body" };
      return next();
    }
    req.data = data;
  } catch (e) {
    req.err = e;
  }
  next();
};

export { createFighterValid, updateFighterValid };

function validate(body, data, type) {
  for (const field of Object.keys(FIGHTER)) {
    if (field === "id") {
      continue;
    }

    if (field === "health") {
      const value = body[field];
      console.log("value: ", value);
      if (value && (value < 80 || value > 120)) {
        throw { message: `Error in ${field}` };
      }
      data[field] = value || 100;
    }

    if (field === "defense") {
      const value = body[field];
      if ((!value && type === "create") || value < 1 || value > 10) {
        throw { message: `Error in ${field}` };
      }
      data[field] = value;
    }

    if (field === "power") {
      const value = body[field];
      if ((!value && type === "create") || value < 1 || value > 100) {
        throw { message: `Error in ${field}` };
      }
      data[field] = value;
    }
    if (field === "name") {
      const value = body[field];
      const user = fighterRepository.getOne({ name: value?.toLowerCase() });
      if (user) {
        throw { message: `Error in ${field}` };
      }
      data[field] = body[field].toLowerCase();
    }
  }
}
