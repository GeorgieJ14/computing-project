'use server';

import { InferenceClient } from "@huggingface/inference";
import prisma from "./database/prisma/prisma";

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

export async function huggingFaceApi(tickets: {tickets: typeof prisma.ticket[]}) {
  
  const chatInput1 = {
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [{ role: "user", content: "Hello, nice to meet you!" }],
    max_tokens: 512
  };
  // Chat completion API
  const out = await client.chatCompletion(chatInput1);

  await prisma.huggingFaceAPI.create({
    data: {
      model: chatInput1.model,
      prompt: chatInput1.messages[0].content,
      response: out.choices[0].message,
    }
  }); 

  console.log(out.choices[0].message);
  return tickets.map(ticket => ({
    id: ticket.id,
    category: ticket.category,

  }));

  /* // pass multimodal files or URLs as inputs
  await client.imageToText({
    model: 'nlpconnect/vit-gpt2-image-captioning',
    data: await ().blob(),
  }) */
}

/* export async function fetchHuggingFaceData() {
  'use client';
  const response = await fetch('https://api-inference.huggingface.co/models/your-model-name', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_HUGGINGFACE_API_KEY`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: 'Your input data here' }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Hugging Face API');
  }

  const data = await response.json();
  return data;
}

export async function processHuggingFaceResponse(response) {
  'use client';
  if (!response || !Array.isArray(response)) {
    throw new Error('Invalid response format from Hugging Face API');
  }

  return response.map(item => ({
    id: item.id,
    category: item.category,
    details: item.details,
    status: item.status,
  }));
} */
