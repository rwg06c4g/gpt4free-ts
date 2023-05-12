import Koa, {Context, Next} from 'koa';
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser';
import {ChatModelFactory, Model} from "../model";
import dotenv from 'dotenv';

dotenv.config();


const chatModel = new ChatModelFactory();

interface AskReq {
    prompt: string;
    model: Model;
}

module.exports = async(req, res) => {
  const {prompt, model = Model.Forefront, ...options} = req.query as unknown as AskReq;
  if (!prompt) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/text');
        res.end("Please enter a prompt");
        return;
  }
  const chat = chatModel.get(model);
  if (!chat) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/text');
        res.end("Model error");
        return;
   }
	const res = await chat.ask({prompt: prompt as string, options});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/text');
  res.end(res);
};
