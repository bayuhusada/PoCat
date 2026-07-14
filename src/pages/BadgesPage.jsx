import useLocalStorage from '../hooks/useLocalStorage'
import BadgeList from '../components/badges/BadgeList'

function BadgesPage() {
  const { data } = useLocalStorage()
  return <BadgeList earnedBadges={data.badges || []} />
}

export default BadgesPage
