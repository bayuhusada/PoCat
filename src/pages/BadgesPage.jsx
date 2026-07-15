import useCloudData from '../hooks/useCloudData'
import BadgeList from '../components/badges/BadgeList'

function BadgesPage() {
  const { badges } = useCloudData()
  return <BadgeList earnedBadges={badges} />
}

export default BadgesPage