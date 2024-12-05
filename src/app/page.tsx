'use client'

import { useState, FormEvent } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setShortUrl('')

    try {
      console.log('Chamando API:', '/api/shorten')
      
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      console.log('Status da resposta:', response.status)
      const data = await response.json()
      console.log('Dados da resposta:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao encurtar URL')
      }

      setShortUrl(data.shortUrl)
      setUrl('')
    } catch (error) {
      console.error('Erro completo:', error)
      setError(error instanceof Error ? error.message : 'Erro ao encurtar URL')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      alert('URL copiada!')
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-600">
      <div className="text-center max-w-md w-full px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Encurtador de URLs
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole sua URL aqui"
            className="w-full px-4 py-3 rounded-lg shadow-lg focus:ring-2 focus:ring-orange-300 outline-none"
            required
            disabled={isLoading}
          />
          
          <button
            type="submit"
            className="w-full bg-white text-orange-600 font-semibold py-3 rounded-lg shadow-lg hover:bg-orange-50 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Encurtando...' : 'Encurtar URL'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
            <p className="text-gray-700 mb-2">URL encurtada:</p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 break-all flex-1"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 