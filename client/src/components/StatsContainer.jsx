import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';

function StatsContainer({ defaultStats }) {
  const stats = [
    {
      title: 'pending applicaitions',
      count: defaultStats?.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#f59e0b',
      bcg: '#efe3c7'
    },
    {
      title: 'scheluded applicaitions',
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#10b981',
      bcg: '#d1fae5'
    },
    {
      title: 'rejected applicaitions',
      count: defaultStats?.declined || 0,
      icon: <FaBug />,
      color: '#ef4444',
      bcg: '#fde8e8'
    }
  ]
  return (
    <Wrapper>

      {
        stats.map((item, index) => {
          return <StatItem key={index} {...item} />
        })
      }
    </Wrapper>
  )
}

export default StatsContainer;