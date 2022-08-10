import { useState } from 'react';

export const useForm = <T extends Object>(initState: T) => {
    const [state, setState] = useState(initState);

    const onChange = (stateUpdated: Partial<T>) => {
        setState({
            ...state,
            ...stateUpdated,
        });
    };

    return {
        ...state,
        form: state,
        onChange,
    };
};
