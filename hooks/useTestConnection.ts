import { sendUserToken } from '@/app/utils/sendUserToken';
import { setApiConnection } from '@/features/connectionSlice'; // setters
import { addMessage, clearMessagesByConnexion } from '@/features/messageStatusSlice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useApiBaseUrl } from './useApiBaseUrl';

export const useTestConnection = () => {
    const dispatch = useDispatch();
    const apiBaseUrl = useApiBaseUrl();

    const checkApiConnection = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch(`${apiBaseUrl}/ping`, { method: 'GET' });
            if (!res.ok) {
                dispatch(clearMessagesByConnexion('api'));
                dispatch(setApiConnection(false));
                dispatch(addMessage("warning", "api", "impossible de se connecter au serveur d'api"));
                return false
            }else{
                dispatch(clearMessagesByConnexion('api'));
                dispatch(setApiConnection(true));
                dispatch(addMessage('success', 'api', 'Connexion établie'));
                sendUserToken(apiBaseUrl); // send user token to backend
            };
            
            const data = await res.json();
            return data.status === 'ok';
        } catch (err) {
            dispatch(clearMessagesByConnexion('api'));
            dispatch(setApiConnection(false));
            dispatch(addMessage("error", "api", "impossible de se connecter au serveur d'api : "+err+" base url :"+apiBaseUrl));
            return false;
        }
    }, [apiBaseUrl]);

    return { checkApiConnection };
};