import styles from '../style/statistics.module.css';
import { useState, useRef, useEffect } from 'react';
import { DownOutlined, ArrowUpOutlined, CommentOutlined, CloseOutlined } from '@ant-design/icons'
import * as base64 from 'base-64';
import CryptoJs from 'crypto-js';


export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const connectedRef = useRef(false); // WebSocket连接状态的Ref
    const socketRef = useRef(null); // Persistent WebSocket reference
    const [isLoading, setIsLoading] = useState(false); // 添加加载状态
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);


    // 生成鉴权URL并连接WebSocket
    useEffect(() => {
        const generateAuthUrl = async () => {
            const APIKey = 'ae914ae2958573989dfe0ac09bf98d2e';  // 你的APIKey
            const APISecret = 'ZjU2Zjg3OTZhYmQ5ZTBhMzYyNGQyYmEy'; // 你的APISecret
            const host = 'spark-api.xf-yun.com';  // API服务地址
            const path = '/v1.1/chat';  // API路径
            const date = new Date().toUTCString();  // 获取当前UTC时间

            // 构建签名所需的字符串
            const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

            // 使用 CryptoJS 生成 HMAC-SHA256 签名
            const signatureSha = CryptoJs.HmacSHA256(signatureOrigin, APISecret);
            const signature = CryptoJs.enc.Base64.stringify(signatureSha);  // 将签名转换为Base64字符串

            // 构造 authorization 字符串
            const authorizationOrigin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
            const authorization = base64.encode(authorizationOrigin);  // Base64 编码

            // 拼接 WebSocket URL 参数
            const urlParams = new URLSearchParams({
                authorization,
                date,
                host,
            });

            // 拼接最终的WebSocket URL
            const authUrl = `wss://spark-api.xf-yun.com/v1.1/chat?${urlParams.toString()}`;

            // 调用 WebSocket 连接函数
            connectWebSocket(authUrl);  // 连接到 WebSocket
        };

        generateAuthUrl();
    });

    // WebSocket连接
    const connectWebSocket = (url) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket连接成功');
            connectedRef.current = true; // 通过useRef更新连接状态
            socketRef.current = ws;
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.header.code === 0 && message.payload?.choices?.text?.length > 0) {
                const newMessage = message.payload.choices.text.map((choice) => choice.content).join('');

                // 更新消息时拼接新消息内容
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage?.sender === 'ai') {
                        // 检查新消息是否已经包含在现有消息中
                        if (!lastMessage.text.includes(newMessage)) {
                            // 如果新消息不是现有消息的一部分，才进行拼接
                            const updatedMessage = {
                                ...lastMessage,
                                text: lastMessage.text + newMessage
                            };
                            scrollToBottom();
                            return [...prevMessages.slice(0, -1), updatedMessage];
                        }
                        return prevMessages;
                    } else {
                        scrollToBottom(); // 在新消息添加时滚动
                        return [
                            ...prevMessages,
                            { sender: 'ai', text: newMessage }
                        ];
                    }
                });
            } else {
                console.error('AI响应错误:', message);
            }
        };



        ws.onerror = (error) => {
            console.error('WebSocket连接出错', error);
            connectedRef.current = false; // 出现错误时更新状态
        };

        ws.onclose = () => {
            console.log('WebSocket连接关闭');
            connectedRef.current = false; // 关闭时更新状态
        };
    };

    // 发送用户消息
    const handleSendMessage = async () => {
        // 验证输入和连接状态
        if (!inputText.trim() || !connectedRef.current) {
            return;
        }

        try {
            setIsLoading(true); // 开始加载

            // 创建用户消息
            const userMessage = { role: 'user', content: inputText.trim() };

            // 构建消息payload
            const messagePayload = {
                header: {
                    app_id: 'fc4f38ce',
                    uid: 'USER_ID'
                },
                parameter: {
                    chat: {
                        domain: 'lite',
                        temperature: 0.5,
                        max_tokens: 1024,
                    },
                },
                payload: {
                    message: {
                        text: [
                            { role: 'system', content: '你是一个智能助手' },
                            userMessage,
                        ],
                    },
                },
            };

            // 检查WebSocket连接状态
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                // 先添加用户消息到界面
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'user', text: inputText.trim() }
                ]);

                // 清空输入框
                setInputText('');

                // 发送消息
                socketRef.current.send(JSON.stringify(messagePayload));
            } else {
                throw new Error('WebSocket未连接');
            }
        } catch (error) {
            console.error('发送消息失败:', error);
            // 添加错误提示到消息列表
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: 'system',
                    text: '消息发送失败，请检查网络连接后重试。',
                    isError: true
                }
            ]);
        } finally {
            setIsLoading(false); // 结束加载
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            <div id={styles.toggleContainer}>
                <button 
                    className={styles.chatbotToggle} 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className={isOpen ? styles.hide : ''} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                    <svg className={!isOpen ? styles.hide : ''} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
            </div>
            <div className={`${styles.chatbotPopup} ${isOpen ? styles.show : ''}`}>
                {/**Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
                        <h2 className={styles.logoText}>Chatbot</h2>
                    </div>
                    <button className={styles.headerButton}><DownOutlined /></button>
                </div>

                {/**Body */}
                <div className={styles.chatBody}>
                    <BotMessage message={'你好👋🏻  有什么问题可以随时问我！'} />

                    {messages.map((message, index) => (
                        message.sender === 'user' ? <UserMessage key={index} message={message.text} /> : <BotMessage key={index} message={message.text} />
                    ))}
                    {isLoading && (<BotThinking />)}
                    <div ref={messagesEndRef} />
                </div>

                {/**Footer */}
                <div className={styles.chatFooter}>
                    <form className={styles.chatForm} onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}>
                        <textarea
                            className={styles.messageInput}
                            placeholder="Message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // 阻止换行
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div className={styles.chatControls}>
                            <button type="submit" className={styles.submitButton} onClick={handleSendMessage}
                                disabled={!inputText.trim() || !connectedRef.current}   // 添加禁用状态
                            >
                                <ArrowUpOutlined />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const BotMessage = ({ message }) => {
    return (
        <div className={`${styles.message} ${styles.botMessage}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
            <div className={styles.messageText}>
                {message}
            </div>
        </div>
    );
}

const UserMessage = ({ message }) => {
    return (
        <div className={`${styles.message} ${styles.userMessage}`}>
            <div className={styles.messageText}>
                {message}
            </div>
        </div>
    );
}

const BotThinking = () => {
    return (
        <div className={`${styles.message} ${styles.botMessage} ${styles.thinking}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
            <div className={styles.messageText}>
                <div className={styles.thinkingIndicator}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                </div>
            </div>
        </div>
    );
}