import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { connectDB } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    console.log('Request headers:', Object.fromEntries(req.headers))
    console.log('Request method:', req.method)
    
    const body = await req.json()
    console.log('Request body:', body)
    
    const { url: longUrl } = body

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      )
    }

    const formattedUrl = longUrl;

    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const collection = db.collection('Url')

    const existingUrl = await collection.findOne({ longUrl: formattedUrl })
    if (existingUrl) {
      return NextResponse.json(existingUrl)
    }

    const urlCode = nanoid(6)
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${urlCode}`

    console.log('Criando URL curta:', {
      urlCode,
      shortUrl,
      longUrl: formattedUrl,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    })

    const newUrl = {
      longUrl: formattedUrl,
      shortUrl,
      urlCode,
      clicks: 0,
      createdAt: new Date()
    }

    await collection.insertOne(newUrl)
    console.log('URL criada:', newUrl)

    return NextResponse.json(newUrl, { status: 201 })
  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    )
  }
} 