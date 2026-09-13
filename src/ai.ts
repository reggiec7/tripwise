import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai'
import type { TripItem } from './types'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const ai = new GoogleGenerativeAI(API_KEY)

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string, mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1]
      resolve({
        inlineData: { data: base64Data, mimeType: file.type }
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const tripItemSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    kind: { type: SchemaType.STRING, enum: ['flight', 'hotel', 'activity'], description: "The kind of booking.", format: 'enum' },
    title: { type: SchemaType.STRING, description: "A short, descriptive title for the booking." },
    start: { type: SchemaType.STRING, description: "The start date and time in ISO format (YYYY-MM-DDThh:mm)." },
    end: { type: SchemaType.STRING, description: "The end date and time in ISO format (YYYY-MM-DDThh:mm)." },
    confirmation: { type: SchemaType.STRING, description: "The confirmation number, if present." },
    cost: { type: SchemaType.NUMBER, description: "The total cost of the booking in USD, if present." },
    notes: { type: SchemaType.STRING, description: "Any other relevant notes or details." },
    airline: { type: SchemaType.STRING, description: "For flights only: The airline name." },
    flightNumber: { type: SchemaType.STRING, description: "For flights only: The flight number." },
    from: { type: SchemaType.STRING, description: "For flights only: Departure airport code or city." },
    to: { type: SchemaType.STRING, description: "For flights only: Arrival airport code or city." },
    seat: { type: SchemaType.STRING, description: "For flights only: Seat assignment." },
    address: { type: SchemaType.STRING, description: "For hotels only: The hotel address." },
    roomType: { type: SchemaType.STRING, description: "For hotels only: The room type." },
    location: { type: SchemaType.STRING, description: "For activities only: The location." },
    category: { type: SchemaType.STRING, description: "For activities only: The category (e.g., Tour, Dining, Museum)." },
  },
  required: ['kind', 'title', 'start'],
}

export const parseTravelDocument = async (file: File): Promise<Partial<TripItem>> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.")
  }

  const model = ai.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: tripItemSchema,
    }
  })

  const imagePart = await fileToGenerativePart(file)
  const prompt = "Extract the booking details from this travel document image. Return the information in the requested JSON structure."

  const result = await model.generateContent([prompt, imagePart])
  const response = result.response
  const text = response.text()

  try {
    const data = JSON.parse(text)
    // ensure status is set by default
    data.status = 'confirmed'
    return data as Partial<TripItem>
  } catch (e) {
    console.error("Failed to parse Gemini output:", e)
    throw new Error("Could not extract valid data from the document.")
  }
}
