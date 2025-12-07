import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');
    
    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error: any) {
    console.error('Error reading README:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load documentation' },
      { status: 500 }
    );
  }
}
