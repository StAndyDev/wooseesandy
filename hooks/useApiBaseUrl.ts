import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const useApiBaseUrl = () => {
    // l'url activé
    const activeApiUrl = useSelector((state: RootState) =>
      state.base_url?.urls?.find(url => url.isActiveForApi)
    )
    return activeApiUrl
      ? (activeApiUrl.port)? `${activeApiUrl.protocole}://${activeApiUrl.host}:${activeApiUrl.port}/api` : `${activeApiUrl.protocole}://${activeApiUrl.host}/api`
      : 'https://wooseeandy-backend.onrender.com/api';
  }