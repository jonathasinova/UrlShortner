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
    const collection = db.collection('Url')

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
    
    if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
      destinationUrl = `https://${destinationUrl}`
    }

    console.log('Redirecionando para:', destinationUrl)
    return NextResponse.redirect(destinationUrl)
  } catch (error) {
    console.error('Erro ao redirecionar:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
} 