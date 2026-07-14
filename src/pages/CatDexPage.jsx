import useLocalStorage from '../hooks/useLocalStorage'
import CatDexGrid from '../components/catdex/CatDexGrid'

function CatDexPage() {
  const { getCats } = useLocalStorage()
  return <CatDexGrid cats={getCats()} />
}

export default CatDexPage
