import { USER } from "../models/user.js";
import { userRepository } from "../repositories/userRepository.js";

const createUserValid = (req, res, next) => {
  // TODO: Implement validatior for USER entity during creation
  const data = {};
  try {
    validate(req.body, data, "create");
    req.data = data;
  } catch (e) {
    req.err = e;
  }
  next();
};

const updateUserValid = (req, res, next) => {
  // TODO: Implement validatior for user entity during update
  const data = {};
  if (!req.params.id) {
    req.err = { message: "Need Id" };
    return next();
  }

  const user = userRepository.getOne({ id: req.params.id });
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

export { createUserValid, updateUserValid };

function validate(body, data, type) {
  for (const field of Object.keys(USER)) {
    if (field === "id") {
      continue;
    }
    if (type === "create") {
      if (typeof body[field] !== "string") {
        throw { message: "Error" }; // todo Написать нормальнык ошибки
      }
    } else {
      if (!body[field]) {
        continue;
      }
    }

    if (field === "password") {
      const value = body[field];
      if (!value || value.length < 3) {
        throw { message: "Error" };
      }
    }
    if (field === "email") {
      const value = body[field];
      const user = userRepository.getOne({ email: value });
      if (user) {
        throw { message: "Error" };
      }
      if (!value.includes("@gmail.com")) {
        throw { message: "Error" };
      }
      body[field] = body[field].toLowerCase();
    }
    if (field === "phoneNumber") {
      const value = body[field];
      const user = userRepository.getOne({ phoneNumber: value });
      if (user) {
        throw { message: "Error" };
      }
      if (!value.startsWith("+380")) {
        throw { message: "Error" };
      }
    }
    if (body[field]) {
      data[field] = body[field];
    }
  }
}
