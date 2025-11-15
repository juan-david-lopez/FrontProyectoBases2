import { useContext } from 'react';
import { UIContext } from '../context/UIContext.jsx';

export function useToast() {
	const { toast, openToast, closeToast } = useContext(UIContext);
	return { toast, openToast, closeToast };
}

