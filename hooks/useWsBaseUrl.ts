import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const wooseeandy_token = 'a3b7e8f9c2d4g5h6j0k1l2m3n9p8q7r'
export const useWsBaseUrl = () => {
    // l'url activé
    const activeWsUrl = useSelector((state: RootState) =>
      state.base_url?.urls?.find(url => url.isActiveForWs)
    )
    return activeWsUrl
      ? `${activeWsUrl.protocole}://${activeWsUrl.host}:${activeWsUrl.port}/ws/visitor-tracker/?token=${wooseeandy_token}`
      : `ws://localhost:8000/ws/visitor-tracker/?token=${wooseeandy_token}`;
  }