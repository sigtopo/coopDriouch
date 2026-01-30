
import { GoogleGenAI } from "@google/genai";
import { Cooperative } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeCooperatives(query: string, cooperatives: Cooperative[]) {
    const context = cooperatives.map(c => 
      `${c.name}: ${c.description} في ${c.location} (قطاع ${c.sector})`
    ).join('\n');

    const prompt = `
      بصفتك خبير في التعاونيات والتنمية المجتمعية، ساعد المستخدم في الإجابة على سؤاله: "${query}"
      بناءً على البيانات التالية للتعاونيات المتاحة لدينا:
      ${context}

      يرجى تقديم اقتراحات محددة وشرح لماذا تعتبر هذه التعاونيات مناسبة لطلب المستخدم. 
      تحدث باللغة العربية بأسلوب احترافي ومشجع.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "عذراً، حدث خطأ أثناء تحليل البيانات. حاول مرة أخرى لاحقاً.";
    }
  }

  async generateCooperativeSummary(coop: Cooperative) {
    const prompt = `اكتب ملخصاً جذاباً وتسويقياً لتعاونية "${coop.name}" التي تعمل في قطاع "${coop.sector}" بمدينة "${coop.location}". وصفها هو: ${coop.description}. اجعل الملخص قصيراً (حوالي 30 كلمة) ومقنعاً للمستثمرين أو الشركاء الجدد.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return coop.description;
    }
  }
}

export const geminiService = new GeminiService();
