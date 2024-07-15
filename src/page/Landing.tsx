import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo from '../assets/sowon.webp';
import '../style/Landing.scss';
import { getFineTunedResponse } from '../api';
import upArrow from '../assets/up-arrow.svg';

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
    const [displayedAnswer, setDisplayedAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

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
        setLoading(true);
        setShowGreeting(false);
        setAnswer('');
        setDisplayedAnswer('');

        try {
            const response = await getFineTunedResponse(prompt);
            setAnswer(response || '');
        } catch (error) {
            setAnswer('에러가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
            setPrompt('');
            focusInput();
        }
    };

    useEffect(() => {
        if (answer) {
            let index = -1;
            const interval = setInterval(() => {
                setDisplayedAnswer(prev => prev + answer[index]);
                index += 1;
                if (index === answer.length - 1) {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [answer]);

    return (
        <div className='background'>
            <div className='landing'>
                <img src={Logo} alt="소원이" className='logo white' />
                <div className='message-container'>
                    {loading ? (
                        <Loading />
                    ) : (
                        showGreeting ? (
                            <p>저희 학교에 대해 궁금하신것이 있으신가요 ?</p>
                        ) : (
                            <p className='answer'>{displayedAnswer}</p>
                        )
                    )}
                </div>
                <br />
                <div className='input-container'>
                    <div className='input-box'>
                        <input
                            placeholder="경북소프트웨어마이스터고등학교에 대해 궁금한게 있나요 ?"
                            className='chat-input'
                            value={prompt}
                            onKeyDown={handleKeyDown}
                            onChange={handleInputChange}
                            ref={inputRef}
                        />
                    </div>
                    <button
                        className={`submit ${prompt ? 'active' : ''}`}
                        id='submit'
                        onClick={handleSubmit}
                    >
                        <img src={upArrow} alt="Submit" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
