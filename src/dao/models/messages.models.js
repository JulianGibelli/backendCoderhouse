import { Schema,model } from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new Schema({
     user:{
        type: String,
     }, message: {
        type: String,
     }
})

export const modeloMessages = model(messagesCollection,messagesSchema)