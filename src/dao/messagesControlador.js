import { modeloMessages } from "./models/messages.models.js";

export class Message {
  constructor() {}

  async addMessage(mensaje) {
    await modeloMessages.create( mensaje );
  }
}
