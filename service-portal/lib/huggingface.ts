'use server';

import { InferenceClient,
  /* InferenceClientError,
  InferenceClientProviderApiError,
  InferenceClientProviderOutputError,
  InferenceClientHubApiError,
  InferenceClientInputError, */ } from "@huggingface/inference";
import prisma from "./database/prisma/prisma";
import { readFileSync } from "fs";
import { fetchFilteredTickets } from "./data";

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);
const robertaSpamInput = {
  model: 'mshenoda/roberta-spam',
  inputs: "",
  provider: "hf-inference"
};
const objectDetectInput = {
  accessToken: HF_TOKEN,
  model: 'facebook/detr-resnet-101',
  provider: 'hf-inference',
  inputs: null,
  // data: null,
}
const chatInput1 = {
  model: "meta-llama/Llama-3.1-8B-Instruct",
  messages: [{ role: "user", content: "Hello, nice to meet you!" }],
  max_tokens: 512
};

export async function huggingFaceApi(
  tickets: typeof prisma.ticket[],
  query: string, currentPage: number
) {
  const newTickets1 = await prisma.ticket.findMany({
    where: {
      deletedAt: null,
      categoryId: null,
      // tags: null,
      assignedTo: null,
      status: 'pending'
    },
    include: {
      attachments: true,
      user: true,
    }
  });

  let updatedCount = 0;
  let spamTickets = 0;
  let ticketsAssigned = 0;
  if (!newTickets1 || !newTickets1.length) {
    return {
      updatedTickets: tickets,
      // await fetchFilteredTickets(query, currentPage),
      updatedCount: updatedCount, spamTickets: spamTickets,
      ticketsAssigned: ticketsAssigned
    };
  }
  const spamCatg1 = await prisma.category.findFirst({
    where: {
      name: {
        contains: 'spam'
      }
    }
  });
  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null
    },
    include: {
      users: {
        select:{
          id: true,
          name: true,
          role: true
        }
      },
    /* select: {
      id: true,
      name: true
    }, */
  }});
  if (!categories.length) {
    return {
      updatedTickets: tickets,
      // await fetchFilteredTickets(query, currentPage),
      updatedCount: updatedCount, spamTickets: spamTickets,
      ticketsAssigned: ticketsAssigned
    };
  }

  for (const ticket of newTickets1) {
    const ticketText = "Service-request title: " + ticket.title +
    "\nService-request description: " + ticket.details +
    "\nService-request keywords: " + ticket.tags;
    robertaSpamInput.inputs = ticketText;
    // Spam-text classification M.L-model
    const response1 = await client.textClassification(robertaSpamInput);
    
    if (response1[0].label == 'LABEL_1') {
      await prisma.huggingFaceAPI.create({
        data: {
          model: robertaSpamInput.model,
          prompt: robertaSpamInput.inputs,
          response: response1[0]?.label ? "Label: " + response1[0].label +
            ", Score: " + response1[0].score + ", Label: " + response1[1].label +
            ", Score: " + response1[1].score : '',
          ticketId: ticket.id,
          categoryPredictionLog: {
            create: {
              categoryId: spamCatg1?.id ?? null,
              details: "Spam text-content detected. Request rejected.",
            }
          }
        }
      });
      await prisma.ticket.update({
        where: {
          id: ticket.id
        },
        data: {
          categoryId: spamCatg1?.id ?? null,
          status: 'rejected',
          priority: 'ignore'
        },
      });
      spamTickets++;
      updatedCount++;

      continue;
      /* await prisma.huggingFaceAPI.createMany({
        data: responsesList/* {
          model: chatInput1.model,
          prompt: chatInput1.messages[0].content,
          response: out.choices[0].message.content ?? '',
        }
      }); */
          
    }
    const responsesList = [{
      model: robertaSpamInput.model,
      prompt: robertaSpamInput.inputs,
      response: response1[0]?.label ? "Label: " + response1[0]?.label +
        ", Score: " + response1[0].score + ", Label: " + response1[1].label +
        ", Score: " + response1[1].score : '',
      ticketId: ticket.id
    }];

    const objectsDetected = [];
    
    for (const image1 of ticket.attachments) {
      objectDetectInput.inputs = new Blob([readFileSync(
        "public/file_uploads/ticket_images/" + image1.fileName)],
        {type: image1.contentType});
      if (!objectDetectInput.inputs) {
        continue;
      }
      // Image object-detection M.L-model
      const response2 = await client.objectDetection(objectDetectInput);
      // console.log(response2);
      let objectsString1 = "";
      for (const response of response2) {
        objectsString1 += "Object: " + response.label + ", Score: " +
          response.score + ", ";
        if (ticket.title?.includes(response.label) ||
          ticket.tags?.includes(response.label)) {
          objectsDetected.push(response.label);
        }
      };
      responsesList.push({
        model: objectDetectInput.model,
        prompt: image1.fileName,
        response: objectsString1,
        ticketId: ticket.id
      });
      
    };
    if (categories.length < 2) {
      // console.log(responsesList);
      // Ticket not categorised.
      await prisma.huggingFaceAPI.createMany({
        data: responsesList
      });
      continue;
    }
    
    chatInput1.messages[0].content = ticketText;
    if (objectsDetected.length) {
      chatInput1.messages[0].content +=
        "\nObjects related to the service-request: " + objectsDetected.join(", ");
    }
  
    chatInput1.messages[0].content +=
      "\nPlease choose the most relevant category for the above service-request, from the following category-labels : ";
    for (const category of categories) {
      chatInput1.messages[0].content += category.name + ", ";
    };
    chatInput1.messages[0].content += "\nPlease respond only with the chosen category-label text. Don't give any explanation."
    // A.I chat-bot L.L.M api
    const response3 = await client.chatCompletion(chatInput1);
    // console.log(response3, "Here testing 89723."); //response1);
    responsesList.push({
      model: chatInput1.model,
      prompt: chatInput1.messages[0].content,
      response: response3?.choices[0]?.message?.content ??
        '500 api-response server-error',
      ticketId: ticket.id
    });
    let ticketCatg1; //= categories.find((category) => {
    for (const category1 of categories) {
      if (category1.name.includes(response3?.choices[0]?.message?.content ??
        '500 api-response server-error')) {
        ticketCatg1 = category1;
        break;
      }
    };

    if (!ticketCatg1) {
      // console.log(ticketCatg1 ?? "empty");
      // Ticket not categorised.
      await prisma.huggingFaceAPI.createMany({
        data: responsesList
      });
      continue;
    }

    await prisma.aIModelPrediction.create({
      data: {
        categoryId: ticketCatg1?.id,
        details: '',
        modelResponses: {
          create: responsesList
        }
      }
    });
    const servicePerson = ticketCatg1.users?.find((user) => user.role.id == 3) ??
    null;
    if (servicePerson) {
      ticketsAssigned++;
    }
    await prisma.ticket.update({
      where: {
        id: ticket.id
      },
      data: {
        categoryId: ticketCatg1?.id,
        status: servicePerson ? 'assigned' : 'pending',
        priority: !objectsDetected.length ? 'low' :
          (objectsDetected.length == 1 ? 'medium' : 'high'),
          assignedTo: servicePerson?.id ?? null,
        }
      });
    updatedCount++;
    /* try {
    } catch (error) {
      if (error instanceof InferenceClientProviderApiError) {
        // Handle API errors (e.g., rate limits, authentication issues)
        console.error("Provider API Error:", error.message);
        console.error("HTTP Request details:", error.request);
        console.error("HTTP Response details:", error.response);
      } else if (error instanceof InferenceClientHubApiError) {
        // Handle API errors (e.g., rate limits, authentication issues)
        console.error("Hub API Error:", error.message);
        console.error("HTTP Request details:", error.request);
        console.error("HTTP Response details:", error.response);
      } else if (error instanceof InferenceClientProviderOutputError) {
        // Handle malformed responses from providers
        console.error("Provider Output Error:", error.message);
      } else if (error instanceof InferenceClientInputError) {
        // Handle invalid input parameters
        console.error("Input Error:", error.message);
      } else if (error instanceof InferenceClientError) {
        // Handle errors from @huggingface/inference
        console.error("Error from InferenceClient:", error);
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
    } */
  };
  return await {
    updatedTickets: await fetchFilteredTickets(query, currentPage),
    updatedCount: updatedCount, spamTickets: spamTickets,
    ticketsAssigned: ticketsAssigned
  };
  /*// Chat completion API
  // console.log(response1.choices[0].message);
  return tickets.map(ticket => ({...ticket,
    /* id: ticket.id,
    category: ticket.category, */
  /*}));*/


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
