import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { chatApi } from '@/lib/api';

interface UserProfile {
  id?: number;
  name: string;
  contact: string;
  phone?: string;
  avatar?: string;
  is_online?: boolean;
}

interface Message {
  id: string;
  user_id: number;
  user_name: string;
  channel_id: string;
  content?: string;
  message_type?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  isOwn?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'group' | 'direct';
  icon: string;
  lastMessage?: string;
  unreadCount?: number;
  members?: string[];
}

export default function Chat() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const userProfile = localStorage.getItem('userProfile');
      if (!userProfile) {
        setLoading(false);
        return;
      }

      const profile = JSON.parse(userProfile);
      
      try {
        const userData = await chatApi.registerUser(profile.name, profile.contact);
        setCurrentUser({
          id: userData.user.id,
          name: userData.user.name,
          contact: userData.user.phone,
          phone: userData.user.phone
        });

        loadChannels();
        loadMessages(activeChannel);
        loadOnlineUsers();
      } catch (error) {
        console.error('Ошибка инициализации чата:', error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      chatApi.updateOnlineStatus(currentUser.id!, true);
      loadMessages(activeChannel);
      loadOnlineUsers();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (currentUser.id) {
        chatApi.updateOnlineStatus(currentUser.id, false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, activeChannel]);

  const loadChannels = async () => {
    try {
      const data = await chatApi.getChannels();
      setChannels(data.channels.map((ch) => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
        icon: ch.type === 'public' ? 'MessageSquare' : ch.type === 'group' ? 'Users' : 'User',
        unreadCount: 0
      })));
    } catch (error) {
      console.error('Ошибка загрузки каналов:', error);
      setChannels([
        { id: 'general', name: 'Общий чат', type: 'public', icon: 'MessageSquare', unreadCount: 0 }
      ]);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const data = await chatApi.getMessages(channelId);
      setMessages(data.messages.map((msg) => ({
        ...msg,
        isOwn: currentUser?.id === msg.user_id
      })));
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const data = await chatApi.getOnlineUsers();
      setUsers(data.users);
      setOnlineCount(data.count);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser || !currentUser.id) return;

    try {
      await chatApi.sendMessage({
        channel_id: activeChannel,
        user_id: currentUser.id,
        content: message,
        message_type: 'text'
      });

      setMessage('');
      loadMessages(activeChannel);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current',
      userName: currentUser.name,
      file: {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      },
      timestamp: Date.now(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        if (currentUser) {
          const newMessage: Message = {
            id: Date.now().toString(),
            userId: 'current',
            userName: currentUser.name,
            voice: {
              url: '#',
              duration: 5,
            },
            timestamp: Date.now(),
            isOwn: true,
          };
          setMessages([...messages, newMessage]);
          setIsRecording(false);
        }
      }, 3000);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: Channel = {
      id: Date.now().toString(),
      name: newGroupName,
      type: 'group',
      icon: 'Users',
      unreadCount: 0,
    };

    setChannels([...channels, newGroup]);
    setNewGroupName('');
    setShowCreateGroup(false);
  };

  const handleStartDirectChat = (user: UserProfile) => {
    const existingChannel = channels.find(
      (ch) => ch.type === 'direct' && ch.name === user.name
    );

    if (!existingChannel) {
      const newChannel: Channel = {
        id: `direct-${Date.now()}`,
        name: user.name,
        type: 'direct',
        icon: 'User',
        unreadCount: 0,
      };
      setChannels([...channels, newChannel]);
      setActiveChannel(newChannel.id);
    } else {
      setActiveChannel(existingChannel.id);
    }
    
    setShowUserList(false);
  };

  const currentChannel = channels.find((ch) => ch.id === activeChannel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/ecosystem" className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DEOD
          </Link>
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Icon name="User" size={16} className="text-white" />
                </div>
                <span className="text-sm text-white hidden sm:block">{currentUser.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white">{onlineCount} онлайн</span>
            </div>
            <Link to="/ecosystem">
              <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                <Icon name="ArrowLeft" className="mr-2" size={16} />
                Назад
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Каналы</h2>
              <Button
                size="sm"
                onClick={() => setShowCreateGroup(true)}
                className="bg-cyan-600 hover:bg-cyan-500"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            
            <Button
              onClick={() => setShowUserList(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 justify-start"
            >
              <Icon name="UserPlus" className="mr-2" size={16} />
              Начать личный чат
            </Button>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto">
            {channels.map((channel) => (
              <motion.div
                key={channel.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveChannel(channel.id)}
                className={`p-4 cursor-pointer transition-all border-b border-slate-800 ${
                  activeChannel === channel.id
                    ? 'bg-cyan-600/20 border-l-4 border-l-cyan-500'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${
                    channel.type === 'public' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                    channel.type === 'group' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' :
                    'bg-gradient-to-br from-blue-500 to-purple-600'
                  } flex items-center justify-center`}>
                    <Icon name={channel.icon} size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold truncate">{channel.name}</h3>
                      {channel.unreadCount ? (
                        <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {channel.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    {channel.lastMessage && (
                      <p className="text-xs text-slate-400 truncate">{channel.lastMessage}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900/50 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${
                currentChannel?.type === 'public' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                currentChannel?.type === 'group' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' :
                'bg-gradient-to-br from-blue-500 to-purple-600'
              } flex items-center justify-center`}>
                <Icon name={currentChannel?.icon || 'MessageSquare'} size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentChannel?.name}</h2>
                <p className="text-xs text-slate-400">
                  {currentChannel?.type === 'public' ? 'Публичный канал' :
                   currentChannel?.type === 'group' ? 'Групповой чат' :
                   'Личный чат'}
                </p>
              </div>
              {loading && (
                <div className="ml-auto text-sm text-cyan-400">Загрузка...</div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start gap-2 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-cyan-400">{msg.user_name}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      
                      {msg.content && (
                        <Card className={`p-3 ${
                          msg.isOwn
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                            : 'bg-slate-800'
                        }`}>
                          <p className="text-sm text-white">{msg.content}</p>
                        </Card>
                      )}
                      
                      {msg.file_url && (
                        <Card className={`p-3 ${
                          msg.isOwn
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                            : 'bg-slate-800'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Icon name="Paperclip" size={16} className="text-white" />
                            <span className="text-sm text-white truncate">{msg.file_name}</span>
                            <a href={msg.file_url} download>
                              <Button size="sm" variant="ghost" className="ml-auto">
                                <Icon name="Download" size={14} />
                              </Button>
                            </a>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800">
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0"
              >
                <Icon name="Paperclip" size={20} />
              </Button>
              
              <div className="flex-1">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Введите сообщение..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleVoiceRecord}
                className={`flex-shrink-0 ${isRecording ? 'text-red-400' : ''}`}
              >
                <Icon name={isRecording ? 'Square' : 'Mic'} size={20} />
              </Button>
              
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 flex-shrink-0"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-cyan-500/30 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Создать группу</h3>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Название группы"
                className="bg-slate-800 border-slate-700 text-white mb-4"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  Создать
                </Button>
                <Button
                  onClick={() => setShowCreateGroup(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User List Modal */}
      <AnimatePresence>
        {showUserList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserList(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-cyan-500/30 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Выбрать пользователя</h3>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <Button
                    key={index}
                    onClick={() => handleStartDirectChat(user)}
                    className="w-full justify-start bg-slate-800 hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.contact}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}