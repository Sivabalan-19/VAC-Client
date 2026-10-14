import Cerebras from '@cerebras/cerebras_cloud_sdk';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null || !('role' in value) || !('content' in value)) {
    return false;
  }

  return (
    (value.role === 'user' || value.role === 'assistant') &&
    typeof value.content === 'string'
  );
}

export async function POST(req: Request) {
  const apiKey = process.env['CEREBRAS_API_KEY'];
  if (!apiKey) {
    return Response.json({ error: 'Missing CEREBRAS_API_KEY' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const messages =
    typeof body === 'object' && body !== null && 'messages' in body
      ? (body as { messages?: unknown }).messages
      : undefined;

  if (!Array.isArray(messages) || !messages.every(isChatMessage)) {
    return Response.json({ error: 'Invalid messages payload' }, { status: 400 });
  }

  const client = new Cerebras({ apiKey });

  try {
    const completionCreateResponse = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            `You are the Mind Peace AI assistant. Help the user improve mental well-being and provide supportive, practical guidance related to mental health.

            User context for this demo:
            1) He feels good about Karur.
            2) He got good marks in the mid-term exam.
            3) He has good friends.
            4) He loves playing football.

            Use this context when it is relevant to the user's question. If it is not relevant, respond naturally and helpfully without forcing the context.`,
        },
        ...messages,
      ],
      model: 'llama3.1-8b',
    });

    if (!('choices' in completionCreateResponse)) {
      throw new Error('Cerebras returned an error response');
    }

    const firstChoice = completionCreateResponse.choices?.[0];
    const assistantText =
      (firstChoice && 'message' in firstChoice
        ? firstChoice.message.content
        : undefined) ??
      'I am here with you. Tell me what is on your mind.';

    return Response.json({ text: assistantText });
  } catch (error) {
    console.error('Cerebras chat completion failed', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 502 });
  }
}