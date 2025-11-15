import { useForm as useHookForm } from 'react-hook-form';

export function useForm({ defaultValues, resolver } = {}) {
    // Allow passing a resolver from outside to avoid adding extra deps here
    return useHookForm({ resolver, defaultValues });
}


