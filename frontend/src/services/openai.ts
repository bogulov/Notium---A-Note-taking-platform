import OpenAI from 'openai';

class AIService {
  private client: OpenAI | null = null;

  initialize(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateContent(prompt: string, context?: string): Promise<string> {
    if (!this.client) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      this.initialize(apiKey);
    }

    const systemPrompt = `You are a helpful writing assistant for a note-taking app. 
    Be concise and helpful. Format your responses in clean markdown.`;

    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context from my notes:\n${context}`,
      });
    }

    messages.push({ role: 'user', content: prompt });

    const client = this.client;
    if (!client) throw new Error('OpenAI client not configured');

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      });

      return (completion.choices ?? [])[0]?.message?.content ?? '';
    } catch (error: any) {
      throw new Error(`AI Error: ${error.message}`);
    }
  }
}

export const aiService = new AIService();
