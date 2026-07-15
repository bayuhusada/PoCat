import useCloudData from '../hooks/useCloudData'
import CatDexGrid from '../components/catdex/CatDexGrid'

function CatDexPage() {
  const { cats } = useCloudData()
  return <CatDexGrid cats={cats} />
}

export default CatDexPage