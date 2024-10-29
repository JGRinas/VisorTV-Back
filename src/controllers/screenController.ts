import { Request, Response } from "express";
import { Screen } from "../models/Screen";
import { Component } from "../models/Component";
import { User } from "../models/User";
import { Types } from "mongoose";

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
        res.status(400).json({
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
        weatherItems: component.weatherItems,
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

export const getAssignedScreens = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    let screens;

    if (userRole === "admin") {
      // Si es admin, obtiene todas las pantallas
      screens = await Screen.find().populate("components");
    } else {
      // Si es operador, obtiene solo las pantallas asignadas
      screens = await Screen.find({ assignedOperators: userId }).populate(
        "components"
      );
    }

    if (!screens || screens.length === 0) {
      res.status(404).json({ message: "No se encontraron pantallas." });
      return;
    }

    res.status(200).json(screens);
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).json({ message: "Error al obtener las pantallas." });
  }
};

export const updateScreen = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { screenId } = req.params;
    const { components } = req.body;
    const userId = (req as any).user.id;

    console.log("Buscando pantalla con id:", screenId);
    const screen = await Screen.findById(screenId);

    if (!screen) {
      res.status(404).json({ message: "Pantalla no encontrada" });
      return;
    }

    screen.assignedOperators = screen.assignedOperators || [];

    if (
      (req as any).user.role !== "admin" &&
      !screen.assignedOperators.includes(userId)
    ) {
      res
        .status(403)
        .json({ message: "No tienes acceso para modificar esta pantalla." });
      return;
    }

    // Eliminar componentes anteriores si es necesario
    const oldComponentIds = screen.components.map(
      (component: any) => component._id
    );
    if (oldComponentIds.length > 0) {
      await Component.deleteMany({ _id: { $in: oldComponentIds } });
    }

    // Crear nuevos componentes y obtener sus ObjectIds
    const componentIds: Types.ObjectId[] = []; // Usamos Types.ObjectId
    for (const componentData of components) {
      const newComponent = new Component({
        type: componentData.type,
        imageUrl: componentData.imageUrl,
        title: componentData.title,
        content: componentData.content,
        location: componentData.location,
        weatherItems: componentData.weatherItems,
      });
      await newComponent.save();
      componentIds.push(newComponent._id as Types.ObjectId); // Forzamos el tipo ObjectId
    }

    // Actualizar componentes de la pantalla
    screen.components = componentIds;
    await screen.save();

    res.status(200).json({ message: "Pantalla actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la pantalla:", error);
    res.status(500).json({ message: "Error al actualizar la pantalla" });
  }
};

export const getScreenById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { screenId } = req.params;

  try {
    const screen = await Screen.findById(screenId).populate("components");
    if (!screen) {
      res.status(404).json({ message: "Pantalla no encontrada" });
      return;
    }
    res.status(200).json(screen);
  } catch (error) {
    console.error("Error al obtener la pantalla:", error);
    res.status(500).json({ message: "Error al obtener la pantalla" });
  }
};

export const deleteScreenById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { screenId } = req.params;

  try {
    const screen = await Screen.findById(screenId);
    if (!screen) {
      res.status(404).json({ message: "Pantalla no encontrada" });
      return;
    }

    // Eliminar los componentes asociados
    await Component.deleteMany({ _id: { $in: screen.components } });

    // Eliminar la pantalla
    await screen.deleteOne({ _id: { screenId } });

    res.status(200).json({ message: "Pantalla eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la pantalla:", error);
    res.status(500).json({ message: "Error al eliminar la pantalla" });
  }
};
