import request from "supertest";
import { app } from "../../api";
import { Screen } from "../../src/models/Screen";
import { Component } from "../../src/models/Component";
import { User } from "../../src/models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Mock de Mongoose
jest.mock("../../src/models/Screen");
jest.mock("../../src/models/Component");
jest.mock("../../src/models/User");
jest.mock("../../src/config/db"); // Mockea la conexión a la base de datos

// Mock del middleware de validación de token
jest.mock("../../src/middleware/validateToken", () => {
  return {
    validateToken: (req: any, res: any, next: any) => next(), // Mock del middleware que deja pasar el request
  };
});

// Mock del middleware de isAdmin
jest.mock("../../src/middleware/isAdmin", () => {
  return {
    isAdmin: (req: any, res: any, next: any) => next(), // Mock del middleware que deja pasar el request
  };
});

describe("POST /screens/create", () => {
  beforeAll(() => {
    // Simula la conexión de MongoDB como resuelta
    mongoose.connect = jest.fn().mockResolvedValueOnce(true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería crear una pantalla correctamente si los operadores y componentes son válidos", async () => {
    const validUserMock = { _id: "60f8f45b9f1b4c6d58dbcb50", role: "operator" };
    const fakeToken = jwt.sign(
      { id: "60f8f45b9f1b4c6d58dbcb50", role: "admin" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    (User.findById as jest.Mock).mockResolvedValue(validUserMock);
    (Component.prototype.save as jest.Mock).mockResolvedValue({
      _id: "componentId",
    });
    (Screen.prototype.save as jest.Mock).mockResolvedValue({
      _id: "screenId",
      name: "Pantalla de prueba",
      assignedOperators: [validUserMock._id],
      components: ["componentId"],
    });

    const response = await request(app)
      .post("/screens/create")
      .set("Authorization", `Bearer ${fakeToken}`) // Agregar el token en los headers
      .send({
        name: "Pantalla de prueba",
        assignedOperators: ["60f8f45b9f1b4c6d58dbcb50"],
        components: [
          {
            type: "weather",
            location: {
              country: "Argentina",
              province: "Corrientes",
            },
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Pantalla creada exitosamente");
    expect(Screen.prototype.save).toHaveBeenCalled();
    expect(Component.prototype.save).toHaveBeenCalled();
  });

  it("debería fallar si el operador no existe o no tiene el rol correcto", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/screens/create")
      .send({
        name: "Pantalla de prueba",
        assignedOperators: ["60f8f45b9f1b4c6d58dbcb50"],
        components: [
          {
            type: "weather",
            location: {
              country: "Argentina",
              province: "Corrientes",
            },
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El usuario con ID 60f8f45b9f1b4c6d58dbcb50 no existe o no tiene el rol de admin u operator."
    );
  });

  it("debería fallar si ocurre un error del servidor", async () => {
    (User.findById as jest.Mock).mockRejectedValue(
      new Error("Error en la base de datos")
    );

    const response = await request(app)
      .post("/screens/create")
      .send({
        name: "Pantalla de prueba",
        assignedOperators: ["60f8f45b9f1b4c6d58dbcb50"],
        components: [
          {
            type: "weather",
            location: {
              country: "Argentina",
              province: "Corrientes",
            },
          },
        ],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error al crear la pantalla");
  });
});
