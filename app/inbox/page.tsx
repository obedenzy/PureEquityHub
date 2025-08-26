'use client';

import { useState, useEffect } from 'react';
import { Mail, Search, Send, Paperclip, ArrowLeft } from 'lucide-react';
import { mockMessages } from '../../lib/mockData';
import { Message } from '../../types';
import { getCurrentUser } from '../../lib/auth';

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to send messages');
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: 'recipient-id',
      fromName: currentUser.name,
      toName: composeForm.to,
      subject: composeForm.subject,
      content: composeForm.content,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [newMessage, ...prev]);
    setComposeForm({ to: '', subject: '', content: '' });
    setShowCompose(false);
    alert('Message sent successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">Please log in to access your inbox and manage messages.</p>
          <p className="text-sm text-gray-500">Use the Login button in the header to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-12rem)]">
            
            {/* Message List */}
            <div className={`${selectedMessage ? 'hidden lg:block' : ''} lg:col-span-1 border-r border-gray-200`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                  <button
                    onClick={() => setShowCompose(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Compose
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {unreadCount > 0 && (
                  <div className="mt-3 text-sm text-blue-600 font-medium">
                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${message.isRead ? 'bg-gray-300' : 'bg-blue-600'}`}></div>
                        <span className={`text-sm font-medium ${message.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {message.fromName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <h3 className={`text-sm mb-1 line-clamp-1 ${message.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                      {message.subject}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No messages found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Detail / Compose */}
            <div className="lg:col-span-2">
              {showCompose ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Compose Message</h2>
                      <button
                        onClick={() => setShowCompose(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex-1 p-6 flex flex-col">
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                          type="text"
                          value={composeForm.to}
                          onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Recipient name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          value={composeForm.subject}
                          onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Message subject"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        value={composeForm.content}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Type your message here..."
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </button>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowCompose(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : selectedMessage ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center mb-4 lg:hidden">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="mr-3 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {selectedMessage.subject}
                        </h2>
                        <div className="text-sm text-gray-600">
                          From: <span className="font-medium">{selectedMessage.fromName}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(selectedMessage.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-200">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}