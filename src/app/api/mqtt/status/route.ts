import { NextResponse } from 'next/server';
import { mqttClient } from '@/lib/mqttClient';

export async function GET(request: Request) {
  const isConnected = mqttClient?.connected || false;
  return NextResponse.json({ connected: isConnected });
}
