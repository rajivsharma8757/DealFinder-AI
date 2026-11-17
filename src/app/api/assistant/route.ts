// src/app/api/assistant/route.ts - Conversational AI Assistant API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { processAssistantMessage } from '@/lib/engine/assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], selectedCard } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const response = await processAssistantMessage(message, history, selectedCard);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error processing AI message' },
      { status: 500 }
    );
  }
}
