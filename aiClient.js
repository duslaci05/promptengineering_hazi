import  dotenv  from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";

const envConfig = dotenv.config(); // This loads variables from .env (or .env.local) into process.env

const googleGenerativeAI = new GoogleGenerativeAI(process.env.API_KEY); // Using API_KEY

async function run(){
    
    const model = await googleGenerativeAI.getGenerativeModel({model: "gemini-2.0-flash"});

    const prompt = "What is the capital of France?";

    const result  = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text(); // Corrected: call text() as a function
    console.log("Response: ", text);

}
run(); // Make sure to call the run function