import jwt from "jsonwebtoken";

export interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}
