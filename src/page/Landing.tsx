import { useState } from 'react';
import Logo from '../assets/logo.jpg';
import '../style/Landing.scss';
import { getFineTunedResponse } from '../api';

const Landing = () => {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    };
    
    const handleSubmit = async () => {
        try {
            const response = await getFineTunedResponse(prompt);
            setAnswer(response ?? '');
        } catch (error) {
            console.error("에러 발생:", error);
        }
    };

    return (
        <div className='background'>
            <div className='landing'>
                <img src={Logo} alt="경소고 로고" className='logo white' /> <br />
                <input
                    placeholder="경북소프트웨어마이스터고등학교에 대해 궁금한게 있나요 ?"
                    className='chat-input'
                    value={prompt}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <h4>{answer}</h4>
        </div>
    );
};

export default Landing;
