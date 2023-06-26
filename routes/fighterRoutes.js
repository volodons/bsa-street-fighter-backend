import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";
import { userRepository } from "../repositories/userRepository.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { fighterRepository } from "../repositories/fighterRepository.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      const data = fighterRepository.getAll();
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
      const user = fighterRepository.getOne({ id: req.params.id });
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
      const user = fighterRepository.getOne({ id: req.params.id });
      if (!user) {
        req.err = { message: "User not found", status: 404 };
        return next();
      }
      fighterRepository.delete(req.params.id);

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
  createFighterValid,
  (req, res, next) => {
    try {
      if (req.err) {
        return next();
      }
      fighterRepository.create(req.data);
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
  updateFighterValid,
  (req, res, next) => {
    try {
      if (req.err) {
        return next();
      }
      fighterRepository.update(req.params.id, req.data);
    } catch (err) {
      req.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
