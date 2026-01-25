import OpenAI from 'openai';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ApiError(500, 'OpenAI API key not configured', 'CONFIG_ERROR');
    }
    openai = new OpenAI({
      apiKey,
    });
  }
  return openai;
};

interface AIRequest {
  userId: string;
  noteId?: string;
  action: string;
  prompt: string;
  context?: string;
  model?: string;
}

export const generateContent = async (request: AIRequest): Promise<string> => {
  const {
    userId,
    noteId,
    action,
    prompt,
    context,
    model = 'gpt-4o-mini',
  } = request;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiTokensUsed: true,
      aiTokensLimit: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
  }

  if (user.aiTokensUsed >= user.aiTokensLimit) {
    throw new ApiError(
      429,
      'AI token limit exceeded. Please upgrade your plan.',
      'AI_LIMIT_EXCEEDED'
    );
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: getSystemPrompt(action),
    },
  ];

  if (context) {
    messages.push({
      role: 'user',
      content: `Context from my notes:\n${context}`,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    if (!usage) {
      throw new ApiError(500, 'Failed to get token usage from OpenAI', 'AI_ERROR');
    }

    const costPer1kTokens = model === 'gpt-4o' ? 0.005 : 0.0005;
    const cost = (usage.total_tokens / 1000) * costPer1kTokens;

    await prisma.aIUsage.create({
      data: {
        userId,
        noteId,
        action,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        model,
        costUsd: cost,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        aiTokensUsed: {
          increment: usage.total_tokens,
        },
      },
    });

    return response;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new ApiError(
        429,
        'OpenAI rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED'
      );
    }
    throw new ApiError(500, `AI service error: ${error.message}`, 'AI_ERROR');
  }
};

const getSystemPrompt = (action: string): string => {
  const prompts: Record<string, string> = {
    generate:
      'You are a helpful assistant for note-taking. Generate clear, well-structured content based on user requests.',
    improve:
      'You are an expert editor. Improve the given text while maintaining its core message. Make it more professional, clear, and concise.',
    summarize:
      'You are a summarization expert. Create concise, accurate summaries that capture key points.',
    translate:
      'You are a professional translator. Translate the text accurately while maintaining tone and context.',
    answer:
      'You are a knowledgeable assistant. Answer questions based on the provided context clearly and accurately.',
  };

  return prompts[action] || prompts.generate;
};
