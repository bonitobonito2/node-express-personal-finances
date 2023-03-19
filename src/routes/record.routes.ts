import express from "express";
import { createRecordValidate } from "../requestValidations/record/createRecord.joy";
import {
  createRecord,
  getFilteredRecord,
} from "../controller/record/record.controller";

const RecordRouter = express.Router();

RecordRouter.post("/create", createRecordValidate, createRecord);

RecordRouter.get("/filter", getFilteredRecord);

export default RecordRouter;
