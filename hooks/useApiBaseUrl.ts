import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const useApiBaseUrl = () => {
    // l'url activé
    const activeApiUrl = useSelector((state: RootState) =>
      state.base_url?.urls?.find(url => url.isActiveForApi)
    )
    return activeApiUrl
      ? `${activeApiUrl.protocole}://${activeApiUrl.host}:${activeApiUrl.port}/api`
      : 'http://localhost:8000/api';
  }
  