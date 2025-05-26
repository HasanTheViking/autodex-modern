import { useRouter } from 'next/router'

export default function Kontakt() {
  const { query } = useRouter()
  if (query.sent) {
    return <div className="text-center p-8 bg-gray-200 rounded">Ďakujeme, objednávka bola odoslaná!</div>
  }
  return <div className="text-center p-8">Kontaktujte nás na info@autodex.sk</div>
}
