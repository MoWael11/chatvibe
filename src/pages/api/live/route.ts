import { NextResponse } from 'next/server'

export async function GET(req: Request, res: Response) {
  console.log('resì')

  return NextResponse.json('hello')
}

export async function POST(req: Request, res: Response) {
  console.log('post')
  return NextResponse.json('hello')
}
