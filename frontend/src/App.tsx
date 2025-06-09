import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { config } from './config'

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['message'],
    queryFn: async () => {
      const { data } = await axios.get(config.apiUrl)
      return data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  return (
    <div className="app">
      <h1>Frontend</h1>
      <p>{data?.message}</p>
    </div>
  )
}

export default App
