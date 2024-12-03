import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { shortId: string } }
) {
  if (!params.shortId) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    console.log('Tentando encontrar URL para código:', params.shortId)
    const db = await connectDB()
    const collection = db.collection('urls')

    const url = await collection.findOneAndUpdate(
      { urlCode: params.shortId.trim() },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    )

    console.log('URL encontrada:', url.value)

    if (!url.value) {
      console.log(`URL não encontrada para o código: ${params.shortId}`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    let destinationUrl = url.value.longUrl
    
    // Verifica e corrige a URL de destino
    try {
      new URL(destinationUrl) // Testa se é uma URL válida
    } catch {
      // Se não for uma URL válida, adiciona https://
      destinationUrl = `https://${destinationUrl}`
    }

    return NextResponse.redirect(destinationUrl, { status: 301 })
  } catch (error) {
    console.error('Erro ao redirecionar:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
} 