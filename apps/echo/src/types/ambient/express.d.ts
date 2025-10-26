// TODO: refactor this
declare namespace Express {
  export interface Request {
    user?: import('@orpheus/schemas').UserSession;
  }
}
