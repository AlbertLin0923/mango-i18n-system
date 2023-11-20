import { Navigate } from 'react-router-dom'

const Home: FC = () => {
  return <Navigate replace={true} to="/locale" />
}

export default Home
