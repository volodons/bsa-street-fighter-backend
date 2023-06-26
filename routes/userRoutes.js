import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import { userRepository } from "../repositories/userRepository.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      const data = userRepository.getAll();
      req.data = data;
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);
router.get(
  "/:id",
  (req, res, next) => {
    try {
      const user = userRepository.getOne({ id: req.params.id });
      if (!user) {
        req.err = { message: "User not found", status: 404 };
        return next();
      }

      req.data = user;
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);
router.delete(
  "/:id",
  (req, res, next) => {
    try {
      const user = userRepository.getOne({ id: req.params.id });
      if (!user) {
        req.err = { message: "User not found", status: 404 };
        return next();
      }
      userRepository.delete(req.params.id);

      req.data = user;
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);
router.post(
  "/",
  createUserValid,
  (req, res, next) => {
    try {
      if (req.err) {
        return next();
      }
      userRepository.create(req.data);
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);
router.put(
  "/:id",
  updateUserValid,
  (req, res, next) => {
    try {
      if (req.err) {
        return next();
      }
      userRepository.update(req.params.id, req.data);
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
