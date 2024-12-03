import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { shortId: string } }
) {
  try {
    console.log('Redirecionando:', params.shortId)
    
    const db = await connectDB()
    const collection = db.collection('Url')

    const url = await collection.findOneAndUpdate(
      { urlCode: params.shortId },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    )

    if (!url.value) {
      console.log('URL não encontrada')
      return NextResponse.redirect(new URL('/', request.url))
    }

    const destinationUrl = url.value.longUrl.startsWith('http')
      ? url.value.longUrl
      : `https://${url.value.longUrl}`

    console.log('Destino:', destinationUrl)
    return NextResponse.redirect(destinationUrl)
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
} 