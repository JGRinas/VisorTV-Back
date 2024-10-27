import request from "supertest";
import { app } from "../../api";
import { Screen } from "../../src/models/Screen";
import { Component } from "../../src/models/Component";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Mock de Mongoose
jest.mock("../../src/models/Screen");
jest.mock("../../src/models/Component");
jest.mock("../../src/models/User");
jest.mock("../../src/config/db"); // Mockea la conexión a la base de datos

// Mock del middleware de validación de token
jest.mock("../../src/middleware/validateToken", () => ({
  validateToken: (req: any, res: any, next: any) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token) as any;

    req.user = {
      id: decodedToken.id,
      role: decodedToken.role,
    };
    next();
  },
}));

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

describe("PUT /screens/update/:screenId", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Asegurarse de que no haya interferencias entre tests
  });

  it("debería actualizar la pantalla y eliminar componentes antiguos si el usuario es admin", async () => {
    const mockScreen = {
      _id: "screenId",
      components: [{ _id: new mongoose.Types.ObjectId() }], // Usa un ObjectId válido
      assignedOperators: ["admin"],
      save: jest.fn(),
    };

    (Screen.findById as jest.Mock).mockResolvedValue(mockScreen);
    (Component.deleteMany as jest.Mock).mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });

    (Component.prototype.save as jest.Mock).mockResolvedValue({
      _id: "newComponentId",
    });

    mockScreen.save.mockResolvedValue(mockScreen);

    const response = await request(app)
      .put("/screens/update/screenId")
      .set("Authorization", `Bearer ${fakeTokenAdmin}`)
      .send({
        components: [
          {
            type: "weather",
            location: { country: "Argentina", province: "Corrientes" },
          },
        ],
      });

    expect(Component.deleteMany).toHaveBeenCalledWith({
      _id: { $in: [expect.any(mongoose.Types.ObjectId)] },
    });
    expect(Component.prototype.save).toHaveBeenCalled();
    expect(mockScreen.save).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Pantalla actualizada correctamente");
  });

  it("debería devolver 403 si el operador no tiene acceso a la pantalla", async () => {
    const mockScreen = {
      _id: "screenId",
      assignedOperators: ["otherOperatorId"],
      components: [],
      save: jest.fn(),
    };

    (Screen.findById as jest.Mock).mockResolvedValue(mockScreen);

    const response = await request(app)
      .put("/screens/update/screenId")
      .set("Authorization", `Bearer ${fakeTokenOperator}`)
      .send({ components: [] });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "No tienes acceso para modificar esta pantalla."
    );
  });

  it("debería devolver 500 si ocurre un error al buscar la pantalla", async () => {
    (Screen.findById as jest.Mock).mockRejectedValue(
      new Error("Error en la base de datos")
    );

    const response = await request(app)
      .put("/screens/update/screenId")
      .set("Authorization", `Bearer ${fakeTokenOperator}`)
      .send({ components: [] });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error al actualizar la pantalla");
  });
});
