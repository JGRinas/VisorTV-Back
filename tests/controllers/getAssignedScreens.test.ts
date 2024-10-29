import request from "supertest";
import { app } from "../../api";
import { Screen } from "../../src/models/Screen";
import jwt from "jsonwebtoken";

// Mock de Mongoose
jest.mock("../../src/models/Screen");
jest.mock("../../src/models/Component");
jest.mock("../../src/models/User");
jest.mock("../../src/config/db"); // Mockea la conexión a la base de datos

// Mock del middleware de validación de token
jest.mock("../../src/middleware/validateToken", () => ({
  validateToken: (req: any, res: any, next: any) => {
    req.user = {
      id: "60f8f45b9f1b4c6d58dbcb50",
      role: req.headers.authorization.includes("admin") ? "admin" : "operator",
    };
    next();
  },
}));

// Mock del middleware de isAdminOrOperator
jest.mock("../../src/middleware/isAdminOrOperator", () => {
  return {
    isAdminOrOperator: (req: any, res: any, next: any) => next(), // Mock del middleware que deja pasar el request
  };
});

const fakeTokenAdmin = jwt.sign(
  { id: "60f8f45b9f1b4c6d58dbcb50", role: "admin" },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);
const fakeTokenOperator = jwt.sign(
  { id: "60f8f45b9f1b4c6d58dbcb50", role: "operator" },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);

describe("GET /screens/assigned", () => {
  it("debería devolver todas las pantallas si el usuario es admin", async () => {
    const mockScreens = [
      { _id: "screenId", name: "Pantalla de prueba", components: [] },
    ];

    (Screen.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockScreens), // Mockea correctamente find + populate
    }));

    const response = await request(app)
      .get("/screens/assigned")
      .set("Authorization", `Bearer ${fakeTokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockScreens);
  });

  it("debería devolver solo las pantallas asignadas al operador", async () => {
    const mockScreens = [
      { _id: "screenId", name: "Pantalla de prueba", components: [] },
    ];

    (Screen.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockScreens),
    }));

    const response = await request(app)
      .get("/screens/assigned")
      .set("Authorization", `Bearer ${fakeTokenOperator}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockScreens);
  });

  it("debería devolver 404 si no hay pantallas", async () => {
    (Screen.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([]), // Mock con resultado vacío
    }));

    const response = await request(app)
      .get("/screens/assigned")
      .set("Authorization", `Bearer ${fakeTokenOperator}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No se encontraron pantallas.");
  });

  it("debería devolver 500 si ocurre un error", async () => {
    (Screen.find as jest.Mock).mockImplementation(() => ({
      populate: jest
        .fn()
        .mockRejectedValue(new Error("Error en la base de datos")), // Mock con error
    }));

    const response = await request(app)
      .get("/screens/assigned")
      .set("Authorization", `Bearer ${fakeTokenOperator}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error al obtener las pantallas.");
  });
});
