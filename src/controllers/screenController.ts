import { Request, Response } from "express";
import { Screen } from "../models/Screen";
import { Component } from "../models/Component";
import { User } from "../models/User";

export const createScreen = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, assignedOperators, components } = req.body;

  try {
    // Validación de que los operadores asignados existan y sean admin u operator
    const validOperators = [];
    for (const operatorId of assignedOperators) {
      const operator = await User.findById(operatorId);
      if (!operator || !["admin", "operator"].includes(operator.role)) {
        res
          .status(400)
          .json({
            message: `El usuario con ID ${operatorId} no existe o no tiene el rol de admin u operator.`,
          });
        return;
      }
      validOperators.push(operator._id);
    }

    // Validación de componentes y almacenamiento
    const componentIds = [];
    for (const component of components) {
      const newComponent = new Component({
        type: component.type,
        imageUrl: component.imageUrl,
        title: component.title,
        content: component.content,
        location: component.location,
      });
      await newComponent.save();
      componentIds.push(newComponent._id);
    }

    // Crear la nueva pantalla
    const screen = new Screen({
      name,
      assignedOperators: validOperators,
      components: componentIds,
    });

    await screen.save();

    res.status(201).json({ message: "Pantalla creada exitosamente", screen });
  } catch (error) {
    console.error(error); // Esto te ayudará a depurar el problema
    res.status(500).json({ message: "Error al crear la pantalla" });
  }
};
