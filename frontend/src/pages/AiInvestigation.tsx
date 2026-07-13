import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, Send, Sparkles, Copy, Bot, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MOCK_ALERTS } from '../services/mockData';
import { useToast } from '../components/ui/Toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AiInvestigation() {
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: alerts } = useQuery({
    queryKey: ['alerts_list_ai'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        return MOCK_ALERTS;
      }
      const res = await api.get('/api/v1/alerts');
      return res.data;
    }
  });

  const filteredAlerts = alerts?.filter((a: any) => a.id.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  const selectedAlert = alerts?.find((a: any) => a.id === selectedAlertId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedAlertId) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `I've loaded context for alert **${selectedAlertId}**. How can I help you investigate this? You can ask me to summarize the timeline, extract indicators of compromise, or suggest mitigation steps.`
      }]);
    } else {
      setMessages([]);
    }
  }, [selectedAlertId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedAlertId) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Mock AI response
      await new Promise(r => setTimeout(r, 1500));
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on the telemetry for ${selectedAlertId}, the impossible travel flag was triggered because authentication succeeded from an IP in Russia (185.15.2.x) exactly 12 minutes after a physical badge-in in New York. I recommend immediately isolating endpoint ${selectedAlert?.entity_id} and revoking session tokens.`
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Error:** Couldn't reach the AI service — try again.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', type: 'info', duration: 2000 });
  };

  return (
    <div className="flex h-full gap-6">
      
      {/* Alert Picker (Left) */}
      <Card className="w-80 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-alt/30">
          <h2 className="font-semibold mb-3">Select Context</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search alert ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredAlerts.map((alert: any) => (
            <button
              key={alert.id}
              onClick={() => setSelectedAlertId(alert.id)}
              className={`w-full text-left p-3 rounded-md transition-colors ${selectedAlertId === alert.id ? 'bg-surface-alt border border-border shadow-glow' : 'hover:bg-surface-alt/50 border border-transparent'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm font-semibold text-text-primary">{alert.id}</span>
                <Badge variant={alert.severity} className="text-[10px] uppercase py-0 leading-none h-4">{alert.severity}</Badge>
              </div>
              <div className="text-xs text-text-muted truncate">
                {alert.factors.join(', ').replace(/_/g, ' ')}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Chat Thread (Right) */}
      <Card className="flex-1 flex flex-col overflow-hidden relative bg-[#0A0D14]">
        {!selectedAlertId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <Sparkles className="w-12 h-12 mb-4 text-surface-alt" />
            <p>Select an alert to begin an investigation conversation.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border bg-surface flex justify-between items-center shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-semibold text-sm">Investigating {selectedAlertId}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="h-8">
                Clear conversation
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-surface-alt text-text-primary rounded-tr-sm border border-border' 
                        : 'bg-surface border border-border text-text-primary rounded-tl-sm shadow-sm'
                    }`}>
                      {/* Very basic markdown bold rendering for mock */}
                      <span dangerouslySetInnerHTML={{__html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-3 mt-2 px-1">
                        <span className="text-[10px] text-text-muted italic flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Generated by Gemini
                        </span>
                        <button onClick={() => copyToClipboard(msg.content)} className="text-text-muted hover:text-text-primary transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-accent animate-pulse" />
                  </div>
                  <div className="bg-surface border border-border p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-surface shrink-0">
              <form onSubmit={handleSend} className="relative">
                <Input 
                  placeholder="Ask Gemini to analyze process trees, explain risk scores, or draft a report..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pr-12 bg-surface-alt/50 h-12"
                  disabled={isTyping || !selectedAlertId}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-accent text-background hover:bg-accent/90"
                  disabled={!inputValue.trim() || isTyping || !selectedAlertId}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
