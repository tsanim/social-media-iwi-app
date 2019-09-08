import { useState } from 'react';

function useForms(callback, isRegister) {
    const [inputs, setInputs] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        callback();

        if (isRegister === undefined && !isRegister) {
            setInputs(inputs => ({}))
        }
    }

    const handleChangeInput = (e) => {
        e.persist();
        setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    }

    return {
        inputs,
        handleSubmit,
        handleChangeInput
    }
}

export default useForms;