import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextContext.js';

export function useAuth() {
	return useContext(AuthContext);
}

