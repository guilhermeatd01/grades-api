import { db } from "../models/index.js";
import { logger } from "../config/logger.js";
import gradeModel from "../models/gradeModel.js";

const GradeModel = db.gradeModel;

const create = async (req, res) => {
  const { name, subject, type, value } = req.body;

  const grade = new GradeModel({ name, subject, type, value });

  try {
    const data = await grade.save();
    res.send({ message: "Grade inserido com sucesso", data });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: `Algum erro ocorreu ao salvar: ${error.message} ` });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    const grade = await gradeModel.find({ condition });

    if (!grade) {
      res.status(404).send("Dados não encontrados");
    } else {
      res.send(grade);
    }

    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Erro ao listar todos os documentos" });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await GradeModel.findById({ _id: id });

    if (!grade) {
      res.status(404).send("Dados não encontrados");
    } else {
      res.send(grade);
    }

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar o Grade id: " + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dados para atualizacao vazio",
    });
  }

  const id = req.params.id;

  try {
    const grade = await GradeModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!grade) {
      res.status(404).send("Dados não encontrados");
    } else {
      res.send(grade);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar a Grade id: " + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {

    const grade = GradeModel.findByIdAndRemove({_id: id});

    if (!grade) {
      res.status(404).send("Dados não encontrados");
    } else {
      res.send('Dados excluídos com sucesso');
    }

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Nao foi possivel deletar o Grade id: " + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {

    const grade = GradeModel.deleteMany();

    if (!grade) {
      res.status(404).send("Dados não encontrados");
    } else {
      res.send('Dados excluídos com sucesso');
    }

    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao excluir todos as Grades" });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
