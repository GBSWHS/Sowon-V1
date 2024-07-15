import React, { useState } from 'react';
import Logo from '../assets/sowon.webp';
import '../style/Landing.scss';
import { getFineTunedResponse } from '../api';

const Loading = () => (
    <div className="typing-indicator">
        <div className="typing-circle typing-circle-1"></div>
        <div className="typing-circle typing-circle-2"></div>
        <div className="typing-circle typing-circle-3"></div>
        <div className="typing-shadow typing-shadow-1"></div>
        <div className="typing-shadow typing-shadow-2"></div>
        <div className="typing-shadow typing-shadow-3"></div>
    </div>
);

const Landing = () => {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();

        // Clear the input field immediately
        setPrompt('');
        setLoading(true);

        try {
            const response = await getFineTunedResponse(prompt);
            setAnswer(response ?? '');
        } catch (error) {
            console.error("에러 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='background'>
            <div className='landing'>
                <img src={Logo} alt="경소고 로고" className='logo white' />
                {loading ? <Loading /> : <p className='answer'>{answer}</p>}
                <br />
                <div className='input-container'>
                    <div className='input-box'>
                        <input
                            placeholder="경북소프트웨어마이스터고등학교에 대해 궁금한게 있나요 ?"
                            className='chat-input'
                            value={prompt}
                            onKeyDown={handleKeyDown}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button onClick={handleSubmit}>🔍︎</button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
