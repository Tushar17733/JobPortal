import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { MessageCircle, Send, User } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { APPLICATION_API_ENDPOINT, USER_API_ENDPOINT, MESSAGING_API_ENDPOINT } from '../utils/constant'

export default function Messages() {
    const { user } = useSelector(store => store.auth);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEligible, setIsEligible] = useState(false);

    // Check if user is eligible for messaging (selected in any job)
    useEffect(() => {
        const checkEligibility = async () => {
            if (!user) return;
            
            try {
                const response = await axios.get(`${MESSAGING_API_ENDPOINT}/check-eligibility`, {
                    withCredentials: true
                });
                setIsEligible(response.data.eligible);
            } catch (error) {
                console.error('Error checking eligibility:', error);
            }
        };

        checkEligibility();
    }, [user]);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user || !isEligible) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`${MESSAGING_API_ENDPOINT}/conversations`, {
                    withCredentials: true
                });
                setConversations(response.data.conversations || []);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error('Failed to load conversations');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user, isEligible]);

    // Fetch messages for selected conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation) return;
            
            try {
                const response = await axios.get(`${MESSAGING_API_ENDPOINT}/messages/${selectedConversation._id}`, {
                    withCredentials: true
                });
                setMessages(response.data.messages || []);
                
                // Update the unread count to 0 for this conversation
                setConversations(prevConversations => 
                    prevConversations.map(conv => 
                        conv._id === selectedConversation._id 
                            ? { ...conv, unreadCount: 0 } 
                            : conv
                    )
                );
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error('Failed to load messages');
            }
        };

        fetchMessages();
    }, [selectedConversation]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const response = await axios.post(`${MESSAGING_API_ENDPOINT}/messages/send`, {
                conversationId: selectedConversation._id,
                content: newMessage.trim()
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setMessages(prev => [...prev, response.data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto mt-8 px-4">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
                            <p className="text-gray-600">Please log in to access your messages.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!isEligible) {
        return (
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto mt-8 px-4">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No Messages Available</h2>
                            <p className="text-gray-600">
                                You can only message recruiters after being selected for a job position. 
                                Keep applying and check back once you're shortlisted!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto mt-8 px-4">
                <h1 className="text-2xl font-bold mb-6">Messages</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Conversations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-4 text-center">Loading...</div>
                                ) : conversations.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No conversations yet
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {conversations.map((conversation) => (
                                            <div
                                                key={conversation._id}
                                                onClick={() => setSelectedConversation(conversation)}
                                                className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                                                    selectedConversation?._id === conversation._id 
                                                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                                                        : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {conversation.participants?.find(p => p._id !== user._id)?.fullName || 'Recruiter'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {conversation.job?.title || 'Job Position'}
                                                        </p>
                                                    </div>
                                                    {conversation.unreadCount > 0 && (
                                                        <Badge variant="destructive" className="ml-2">
                                                            {conversation.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                        {selectedConversation ? (
                            <Card className="h-[600px] flex flex-col">
                                <CardHeader className="border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        {selectedConversation.recruiter?.fullName || 'Recruiter'}
                                        <Badge variant="outline" className="ml-auto">
                                            {selectedConversation.job?.title || 'Job Position'}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-1 flex flex-col p-0">
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`flex ${((message.sender && (message.sender._id || message.sender)) === user._id) ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        ((message.sender && (message.sender._id || message.sender)) === user._id)
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-900'
                                                    }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <div className="text-xs opacity-70 mt-1 flex items-center gap-2 justify-end">
                                                        <span>
                                                            {formatTime(message.createdAt)}
                                                        </span>
                                                        {((message.sender && (message.sender._id || message.sender)) === user._id) && (
                                                            <span title={message.isRead ? 'Read' : 'Sent'} className={`inline-block ${message.isRead ? 'text-blue-200' : 'text-white'} ${((message.sender && (message.sender._id || message.sender)) === user._id) ? '' : 'text-gray-500'}`}>
                                                                {message.isRead ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="border-t p-4">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                className="flex-1"
                                            />
                                            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-[600px] flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                                    <p className="text-gray-600">Choose a conversation from the list to start messaging.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
