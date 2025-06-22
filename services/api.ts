/* centralisation d'erreur */
// une instance Axios et un interceptor pour gérer globalement les erreurs de type réseau ou 500.
import { addMessage } from '@/features/messageStatusSlice';
import { store } from '@/store/store';
import axios from 'axios';

const api = axios.create();

let hasNetworkError = false;

api.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error' && !hasNetworkError) {
      hasNetworkError = true;
      store.dispatch(addMessage('error','api','Connexion impossible. Vérifie ton réseau.'));
      setTimeout(() => {
        hasNetworkError = false;
      }, 5000); // évite le spam pendant 5 sec
    } else if (error.response?.status >= 500) {
      store.dispatch(addMessage('error', 'api', 'Erreur serveur. Réessaie plus tard.'));
    }
    return Promise.reject(error);
  }
);

export default api;
