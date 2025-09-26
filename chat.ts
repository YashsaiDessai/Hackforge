
import React, { useState, useEffect, useCallback } from "react";
import { ChatMessage, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MessageCircle, Star, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const loadConversations = useCallback(async (userId) => {
    try {
      const messages = await ChatMessage.filter({
        $or: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      });
      
      const conversationMap = {};
      messages.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!conversationMap[otherId]) {
          conversationMap[otherId] = [];
        }
        conversationMap[otherId].push(msg);
      });

      const conversationsList = await Promise.all(
        Object.entries(conversationMap).map(async ([otherId, msgs]) => {
          const otherUser = users.find(u => u.id === otherId) || 
            await User.filter({ id: otherId }).then(users => users[0]);
          return {
            user: otherUser,
            lastMessage: msgs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0],
            unreadCount: msgs.filter(m => !m.is_read && m.receiver_id === userId).length
          };
        })
      );

      setConversations(conversationsList.filter(c => c.user));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [users, setConversations]); // `users` is used, `setConversations` is a state setter

  const loadData = useCallback(async () => {
    try {
      const [user, allUsers] = await Promise.all([
        User.me(),
        User.list()
      ]);
      setCurrentUser(user);
      setUsers(allUsers.filter(u => u.id !== user.id));
      loadConversations(user.id);
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  }, [loadConversations, setCurrentUser, setUsers]); // `loadConversations` is called, `setCurrentUser` and `setUsers` are state setters

  useEffect(() => {
    loadData();
  }, [loadData]); // `loadData` is a memoized function

  const startChat = useCallback(async (user) => {
    setSelectedChat(user);
    const conversationId = [currentUser.id, user.id].sort().join('-');
    
    const chatMessages = await ChatMessage.filter({
      conversation_id: conversationId
    });
    
    setMessages(chatMessages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
  }, [currentUser, setSelectedChat, setMessages]); // `currentUser` is used, `setSelectedChat` and `setMessages` are state setters

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const conversationId = [currentUser.id, selectedChat.id].sort().join('-');
    
    await ChatMessage.create({
      sender_id: currentUser.id,
      receiver_id: selectedChat.id,
      message: newMessage,
      conversation_id: conversationId
    });

    setNewMessage("");
    // Reload messages
    startChat(selectedChat);
  }, [newMessage, selectedChat, currentUser, setNewMessage, startChat]); // Dependencies: newMessage, selectedChat, currentUser, setNewMessage, startChat

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedChat) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="किसान या खरीदार खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        {conversations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">हाल की बातचीत</h3>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow border-green-100 hover:border-green-300"
                    onClick={() => startChat(conv.user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-green-100">
                          <AvatarFallback className="text-green-700 font-semibold">
                            {conv.user.full_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{conv.user.full_name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">{conv.user.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.message}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-green-600 text-white">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {searchQuery ? 'खोज परिणाम' : 'सभी उपयोगकर्ता'}
          </h3>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-green-100 hover:border-green-300"
                  onClick={() => startChat(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 bg-blue-100">
                        <AvatarFallback className="text-blue-700 font-semibold">
                          {user.full_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{user.full_name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {user.user_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{user.location}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{user.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-green-100 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChat(null)}
          >
            ← वापस
          </Button>
          <Avatar className="h-10 w-10 bg-green-100">
            <AvatarFallback className="text-green-700">
              {selectedChat.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{selectedChat.full_name}</h3>
            <p className="text-sm text-gray-600">{selectedChat.location}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-green-600">
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUser.id;
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  isOwn
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}
              >
                <p>{message.message}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
                  {new Date(message.created_date).toLocaleTimeString('hi-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-green-100 bg-white">
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="संदेश टाइप करें..."
            className="flex-1 rounded-full border-green-200 focus:border-green-400"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            size="icon"
            className="rounded-full bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
