import { useState, useRef, useEffect } from 'react';
import { Button } from './ui';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Code,
  FileText,
  Eye,
  Zap,
} from 'lucide-react';
import { aiAssistant, type AIResponse, type ViewConfiguration } from '@/services/aiAssistant';

interface AIAssistantProps {
  portalType?: 'compliance' | 'tracking' | 'sales' | 'network';
  onViewConfigChange?: (config: ViewConfiguration) => void;
  userData?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  viewConfig?: ViewConfiguration;
}

export function AIAssistant({ portalType, onViewConfigChange, userData }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI assistant. I can help you customize views, generate documents, query data, and more. Try asking me to:\n\n• 'Make this view look like METRC'\n• 'Show me packages with high THC'\n• 'Create a purchase order'\n• 'Change to a compact table view'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: AIResponse = await aiAssistant.processRequest({
        prompt: input,
        context: {
          portalType,
          userData,
          currentView: 'main',
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        data: response.data,
        viewConfig: response.viewConfig,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Apply view configuration if provided
      if (response.viewConfig && onViewConfigChange) {
        onViewConfigChange(response.viewConfig);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Eye, label: 'METRC Style', prompt: 'Make it look exactly like it does on METRC' },
    { icon: Code, label: 'Compact View', prompt: 'Change my view to be more like a table with smaller bubbles and more info' },
    { icon: FileText, label: 'Generate PO', prompt: 'Create a purchase order' },
    { icon: Zap, label: 'Quick Query', prompt: 'Show me my top products by THC%' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-50"
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed inset-x-2 bottom-2 md:inset-x-auto md:right-6 md:bottom-6 bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col z-50 transition-all ${
        isMinimized
          ? 'w-auto md:w-80 h-16'
          : 'w-auto md:w-96 h-[85vh] md:h-[600px] max-h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-charcoal">AI Assistant</h3>
            <p className="text-xs text-slate">Powered by Claude</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-slate" />
            ) : (
              <Minimize2 className="w-4 h-4 text-slate" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-charcoal'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* View Config Preview */}
                  {message.viewConfig && (
                    <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                      <p className="font-semibold mb-1">View Configuration:</p>
                      <p>Layout: {message.viewConfig.layout}</p>
                      <p>Density: {message.viewConfig.density}</p>
                      {message.viewConfig.columns && (
                        <p>Columns: {message.viewConfig.columns.length}</p>
                      )}
                    </div>
                  )}

                  {/* Data Preview */}
                  {message.data && typeof message.data === 'object' && (
                    <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                      {Array.isArray(message.data) ? (
                        <div className="space-y-1">
                          {message.data.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name || item.product || 'Item'}</span>
                              <span className="font-mono">
                                {item.thc ? `${item.thc}%` : item.total ? `$${item.total}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {Object.entries(message.data).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-purple-100 bg-purple-50/30">
            <p className="text-xs text-slate mb-2">Quick Actions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action.prompt);
                      handleSend();
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-purple-50 rounded-lg text-xs text-charcoal border border-purple-100 transition-colors touch-manipulation"
                  >
                    <Icon className="w-3 h-3 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-purple-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm touch-manipulation"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0 touch-manipulation"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
