import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo from '../assets/sowon.webp';
import '../style/Landing.scss';
import { getFineTunedResponse } from '../api';
import upArrow from '../assets/up-arrow.svg';
import Square from '../assets/square.svg';

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

const exampleQuestions = [
    { question: '학교 위치는 어디인가요?', answer: '학교는 경상북도 의성군 봉양면에 위치하고 있습니다.' },
    { question: '입학 조건은 무엇인가요?', answer: '입학 조건은 중학교 졸업 및 서류 시험 및 면접 통과입니다.' },
    { question: '학교 시설은 어떤가요?', answer: '최신 컴퓨터실과 과학 실험실을 갖추고 있습니다.' },
    { question: '교과 과정은 어떻게 되나요?', answer: '교과 과정은 소프트웨어와 과학기술에 중점을 둡니다.' },
];

const Landing = () => {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [displayedAnswer, setDisplayedAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [isAnswering, setIsAnswering] = useState(false);
    const [hasInput, setHasInput] = useState(false);
    const [showExamples, setShowExamples] = useState(true);

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
        setHasInput(e.target.value.length > 0);
    };

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowGreeting(false);
        setAnswer('');
        setDisplayedAnswer('');
        setIsAnswering(true);
        setShowExamples(false);

        try {
            const response = await getFineTunedResponse(prompt);
            setAnswer(response || '');
        } catch (error) {
            setAnswer('에러가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
            setPrompt('');
            setHasInput(false);
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
                    setIsAnswering(false);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [answer]);

    const handleExampleClick = (exampleAnswer: string) => {
        setLoading(true);
        setShowGreeting(false);
        setAnswer('');
        setDisplayedAnswer('');
        setIsAnswering(true);
        setPrompt('');
        setHasInput(false);
        setShowExamples(false);

        setTimeout(() => {
            setAnswer(exampleAnswer);
            setLoading(false);
        }, 500);
    };

    return (
        <div className='background'>
            <div className='landing'>
                <img src={Logo} alt="소원이" className='logo white' />
                <div className='message-container'>
                    {loading ? (
                        <Loading />
                    ) : (
                        showGreeting ? (
                            <p>저희 학교에 대해 궁금하신것이 있으신가요 ? <strong>소원이</strong>에게 물어보세요 !</p>
                        ) : (
                            <p className='answer'>{displayedAnswer}</p>
                        )
                    )}
                </div>
                {showExamples && (
                    <div className='examples'>
                        {exampleQuestions.map((example, index) => (
                            <div
                                key={index}
                                className='example-question'
                                onClick={() => handleExampleClick(example.answer)}
                            >
                                {example.question}
                            </div>
                        ))}
                    </div>
                )}
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
                        className={`submit ${hasInput ? 'has-input' : ''} ${prompt ? 'active' : ''}`}
                        id='submit'
                        onClick={handleSubmit}
                    >
                        <img src={isAnswering ? Square : upArrow} alt="Submit" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
