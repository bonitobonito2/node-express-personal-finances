import express from "express";
import { createRecordValidate } from "../requestValidations/record/createRecord.joy";
import { createRecord } from "../controller/record/record.controller";

const RecordRouter = express.Router();

RecordRouter.post("/create", createRecordValidate, createRecord);

export default RecordRouter;
