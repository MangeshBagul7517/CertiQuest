
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
};

type UserDetails = {
  name: string;
  email: string;
  phone?: string;
  query: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: 'Hello! I\'m the CertiQuest assistant. How can I help you today?',
  },
  {
    id: '2',
    type: 'bot',
    content: 'I can tell you about our courses, enrollment process, or collect your details for personalized assistance.',
  },
];

// Simple responses for common queries
const RESPONSES: Record<string, string[]> = {
  'course': [
    'We offer various certification courses in technology, business, and professional development.',
    'Would you like to know more about any specific course? Or would you like to share your contact details to receive personalized course recommendations?'
  ],
  'enroll': [
    'To enroll in a course, you can create an account, browse our courses, and click on "Enroll" for the course you\'re interested in.',
    'Would you like me to collect your details so our team can help you with enrollment?'
  ],
  'price': [
    'Our course prices vary depending on the program. Basic courses start from ₹5,000 and premium certifications can go up to ₹30,000.',
    'Would you like me to collect your details so our team can provide you with pricing for specific courses?'
  ],
  'contact': [
    'I can collect your contact details so that our team can reach out to you.',
    'Would you like to share your name, email, and phone number?'
  ],
  'default': [
    'I\'m not sure I understand your query. Would you like to speak with our customer service team?',
    'I can collect your details so that someone can get back to you shortly.'
  ]
};

// Flag for collecting user details
enum ChatState {
  CHATTING,
  COLLECTING_NAME,
  COLLECTING_EMAIL,
  COLLECTING_PHONE,
  COMPLETED
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>(ChatState.CHATTING);
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: '', email: '', query: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to handle user messages
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Handle different states of the conversation
    switch (chatState) {
      case ChatState.CHATTING:
        handleRegularChat(input);
        break;
      case ChatState.COLLECTING_NAME:
        handleNameCollection(input);
        break;
      case ChatState.COLLECTING_EMAIL:
        handleEmailCollection(input);
        break;
      case ChatState.COLLECTING_PHONE:
        handlePhoneCollection(input);
        break;
      default:
        // Reset if we're in an unknown state
        setChatState(ChatState.CHATTING);
    }
    
    setInput('');
  };
  
  const handleRegularChat = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Store original query for potential user details collection
    const originalQuery = message;
    
    // Check if message contains keywords for predefined responses
    let foundResponse = false;
    
    for (const [keyword, responses] of Object.entries(RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        foundResponse = true;
        
        // Add response with a slight delay to feel more natural
        setTimeout(() => {
          responses.forEach((response, index) => {
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString() + index,
                  type: 'bot',
                  content: response,
                },
              ]);
            }, index * 800);
          });
        }, 500);
        
        break;
      }
    }
    
    if (!foundResponse) {
      // Use default response if no keyword match
      setTimeout(() => {
        RESPONSES.default.forEach((response, index) => {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString() + index,
                type: 'bot',
                content: response,
              },
            ]);
          }, index * 800);
        });
      }, 500);
    }
    
    // Ask for contact info after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-contact-request',
          type: 'bot',
          content: 'Would you like to share your contact details so our team can assist you better?',
        },
      ]);
      
      setTimeout(() => {
        askForUserDetails(originalQuery);
      }, 1000);
    }, 3000);
  };
  
  const askForUserDetails = (query: string) => {
    setUserDetails(prev => ({ ...prev, query }));
    setChatState(ChatState.COLLECTING_NAME);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Please share your name so we can personalize our assistance.',
        },
      ]);
    }, 500);
  };
  
  const handleNameCollection = (name: string) => {
    setUserDetails(prev => ({ ...prev, name }));
    setChatState(ChatState.COLLECTING_EMAIL);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          content: `Thanks, ${name}! Could you please share your email address?`,
        },
      ]);
    }, 500);
  };
  
  const handleEmailCollection = (email: string) => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'That doesn\'t look like a valid email address. Please try again.',
          },
        ]);
      }, 500);
      return;
    }
    
    setUserDetails(prev => ({ ...prev, email }));
    setChatState(ChatState.COLLECTING_PHONE);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Great! Lastly, could you provide your phone number? (optional)',
        },
      ]);
    }, 500);
  };
  
  const handlePhoneCollection = async (phone: string) => {
    setIsLoading(true);
    setUserDetails(prev => ({ ...prev, phone }));
    
    // Store and send user details
    try {
      // Send the user details to the backend (Supabase function)
      const { error } = await supabase.functions.invoke('send-chatbot-inquiry', {
        body: { 
          name: userDetails.name,
          email: userDetails.email,
          phone,
          query: userDetails.query
        }
      });
      
      if (error) throw error;
      
      setChatState(ChatState.COMPLETED);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'bot',
            content: `Thank you for providing your details! Our team will contact you shortly at ${userDetails.email}.`,
          },
        ]);
        
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'bot',
              content: 'Is there anything else I can help you with today?',
            },
          ]);
          
          // Reset chat state for new conversation
          setChatState(ChatState.CHATTING);
        }, 1500);
      }, 500);
      
    } catch (error) {
      console.error('Error sending chatbot inquiry:', error);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'I apologize, but there was an issue sending your information. Please try again later or contact us directly through the contact page.',
          },
        ]);
        
        // Reset to chatting state
        setChatState(ChatState.CHATTING);
      }, 500);
      
      toast.error('Could not send your inquiry. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button 
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[320px] md:w-[380px] h-[450px] shadow-lg z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground py-3">
            <h3 className="font-semibold">CertiQuest Assistant</h3>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="border-t p-3">
            {isLoading ? (
              <div className="w-full flex justify-center p-2">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
