import Ajv, { Schema } from "ajv";

const ajv = new Ajv();

export const ValidateRequest = <T>(requestBody: unknown, schema: Schema) => {
  const validatorData = ajv.compile<T>(schema);

  if (validatorData(requestBody)) {
    return false;
  }

  const errors = validatorData.errors?.map((err) => err.message);
  return errors && errors[0];
};
