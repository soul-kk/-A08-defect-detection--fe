import React, { useState, useEffect,useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
// import { useEffectOnce } from 'usehooks-ts';
import * as base64 from 'base-64';
import CryptoJs from 'crypto-js';
import styles from './AnswerWindow.module.css';
interface AIResponseChoice {
    content: string;
}

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const connectedRef = useRef<boolean>(false); // WebSocket连接状态的Ref
    const socketRef = useRef<WebSocket | null>(null); // Persistent WebSocket reference
    

    // 生成鉴权URL并连接WebSocket
    useEffect(() => {
        const generateAuthUrl = async () => {
            const APIKey = '65a90ced3e5edfde7b4ac06b707bfe13';  // 你的APIKey
            const APISecret = 'ZGEyNmMwN2M1ODJkMWZmZjc2NTU3MTAz'; // 你的APISecret
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
    const connectWebSocket = (url: string) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket连接成功');
            connectedRef.current = true; // 通过useRef更新连接状态
            socketRef.current = ws;
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.header.code === 0 && message.payload?.choices?.text?.length > 0) {
                const newMessage = message.payload.choices.text.map((choice: AIResponseChoice) => choice.content).join('');

                // 更新消息时拼接新消息内容
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage?.sender === 'ai') {
                        // 如果最后一条是AI消息，拼接新消息内容
                        lastMessage.text += newMessage;
                        return [...prevMessages]; // 不增加新的消息条目
                    } else {
                        // 如果不是AI消息，添加新消息
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
    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        // 创建用户消息
        const userMessage = { role: 'user', content: inputText };

        const messagePayload = {
            header: { app_id: '3e146ceb', uid: 'USER_ID' },
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
                        { role: 'system', content: '你是一个智能助手' }, // 你可以设置系统角色
                        userMessage,
                    ],
                },
            },
        };

        // 确保 WebSocket 连接已建立
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(messagePayload));
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'user', text: inputText },
            ]);
            setInputText('');
        } else {
            console.error('WebSocket未连接');
        }

        
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={styles.box_styles_touchable}>
                    <div className={styles.font_styles}>
                        开始AI聊天
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>AI 聊天</DialogTitle>
                    <DialogDescription>
                        你可以与 AI 进行对话，获取自动化的帮助。
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    {/* 聊天区 */}
                    <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto mb-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-xs ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                                        }`}
                                >
                                    <strong>{message.sender === 'user' ? '你: ' : 'AI: '}</strong>
                                    <span>{message.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* 输入框和发送按钮 */}
                <div className="flex items-center space-x-2">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="p-2 border rounded-md flex-1"
                        placeholder="输入你的问题..."
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        发送
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AIChat;
