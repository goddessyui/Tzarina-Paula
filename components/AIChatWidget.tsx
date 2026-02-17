
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2, GripVertical, Bot, User } from 'lucide-react';
import { ragService } from '../services/ragService';
import { useConfig } from '../contexts/ConfigContext';

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
}

export const AIChatWidget: React.FC = () => {
    const { config } = useConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'ai', text: `Hi! I'm ${config.general.appName}'s AI Digital Twin. Ask me anything about my projects, skills, or process.` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Position State
    const [position, setPosition] = useState({ x: -1, y: -1 });
    const [isDragging, setIsDragging] = useState(false);
    
    // Refs for drag calculations
    const dragStartPos = useRef({ x: 0, y: 0 });
    const widgetStartPos = useRef({ x: 0, y: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    // Initialize position (Bottom Right, above mobile nav/scroll buttons)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 768;
            // The scroll buttons and bottom nav occupy space.
            // On mobile we start it higher.
            setPosition({
                x: window.innerWidth - 84, 
                y: isMobile ? window.innerHeight - 240 : window.innerHeight - 300 
            });
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    // --- DRAG LOGIC ---
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if ((e.target as HTMLElement).closest('.no-drag')) return;
        
        setIsDragging(true);
        
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        dragStartPos.current = { x: clientX, y: clientY };
        widgetStartPos.current = { ...position };
    };

    useEffect(() => {
        const handleDragMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();

            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

            const dx = clientX - dragStartPos.current.x;
            const dy = clientY - dragStartPos.current.y;

            let newX = widgetStartPos.current.x + dx;
            let newY = widgetStartPos.current.y + dy;

            const padding = 16;
            const width = 64; 
            const height = 64;
            
            const maxX = window.innerWidth - width - padding;
            const maxY = window.innerHeight - height - padding;

            newX = Math.max(padding, Math.min(newX, maxX));
            newY = Math.max(padding, Math.min(newY, maxY));

            setPosition({ x: newX, y: newY });
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            setIsDragging(false);
            
            const padding = 20;
            const width = 64; 
            const windowMidX = window.innerWidth / 2;
            
            let finalX = position.x;
            
            if (position.x + width / 2 < windowMidX) {
                 finalX = padding; 
            } else {
                 finalX = window.innerWidth - width - padding; 
            }
            
            setPosition(prev => ({ ...prev, x: finalX }));
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, position]);

    const getAnchorClasses = () => {
        if (typeof window === 'undefined') return 'bottom-0 right-0 origin-bottom-right';

        const isRightHalf = position.x > window.innerWidth / 2;
        const isBottomHalf = position.y > window.innerHeight / 2;

        let classes = '';
        classes += isBottomHalf ? 'bottom-0 ' : 'top-0 ';
        classes += isRightHalf ? 'right-0 ' : 'left-0 ';
        classes += `origin-${isBottomHalf ? 'bottom' : 'top'}-${isRightHalf ? 'right' : 'left'}`;

        return classes;
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userText = input.trim();
        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const history = messages.slice(-5).map(m => m.text);
            const answer = await ragService.chat(userText, history);
            
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: answer };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = { id: Date.now().toString(), role: 'ai', text: "I seem to be having trouble connecting to my neural network. Please try again later." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    if (position.x === -1) return null;

    return (
        <div
            ref={widgetRef}
            style={{ 
                left: position.x, 
                top: position.y,
                touchAction: 'none'
            }}
            className={`fixed z-[100] w-16 h-16 transition-shadow duration-300 ${isDragging ? 'cursor-grabbing z-[110]' : 'z-[100]'}`}
        >
             <div className={`
                absolute ${getAnchorClasses()}
                flex flex-col bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] overflow-hidden
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isOpen 
                    ? 'w-[90vw] h-[70vh] sm:w-[400px] sm:h-[600px] opacity-100 scale-100 pointer-events-auto' 
                    : 'w-16 h-16 opacity-0 scale-50 pointer-events-none'
                }
             `}>
                <div 
                    className={`bg-stone-900 text-white p-4 flex justify-between items-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Bot size={14} className="text-accent" />
                         </div>
                         <div>
                            <h3 className="text-sm font-bold">AI Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-[9px] uppercase tracking-widest text-stone-400">Online</span>
                            </div>
                         </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <GripVertical size={16} className="text-stone-600 opacity-50"/>
                         <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-2 hover:bg-white/10 rounded-full transition-colors no-drag"
                            onMouseDown={(e) => e.stopPropagation()} 
                         >
                            <X size={18} />
                         </button>
                    </div>
                </div>

                <div 
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 no-drag"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center text-white mr-2 mt-2 shrink-0">
                                    <Bot size={12} />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-stone-900 text-white rounded-br-none' 
                                    : 'bg-white border border-stone-100 text-stone-800 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                             <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center text-white mr-2 shrink-0">
                                <Bot size={12} />
                            </div>
                            <div className="bg-white border border-stone-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form 
                    onSubmit={handleSend}
                    className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 no-drag"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <input 
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400"
                        placeholder="Ask about my work..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-stone-900 text-white rounded-xl hover:bg-accent hover:text-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
                    >
                        {isTyping ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                    </button>
                </form>
             </div>

             <button 
                className={`
                    absolute top-0 left-0 w-16 h-16 rounded-full bg-stone-900 text-white shadow-2xl flex items-center justify-center
                    transition-all duration-300 border border-white/10
                    ${isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 scale-100'}
                    ${isDragging ? 'cursor-grabbing scale-95' : 'cursor-grab hover:scale-105 active:scale-95'}
                `}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={(e) => {
                    if (!isDragging) setIsOpen(true);
                }}
             >
                <MessageSquare size={24} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-stone-900 rounded-full animate-pulse"></span>
             </button>
        </div>
    );
};
