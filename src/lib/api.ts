const CHAT_API_URL = 'https://functions.poehali.dev/1b13a1d7-858c-4996-9fd5-18a6cd587522';

interface RegisterUserResponse {
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

interface MessagesResponse {
  messages: Array<{
    id: number;
    channel_id: string;
    user_id: number;
    user_name: string;
    content: string;
    message_type: string;
    file_url?: string;
    file_name?: string;
    created_at: string;
  }>;
  channel_id: string;
}

interface OnlineUsersResponse {
  users: Array<{
    id: number;
    name: string;
    phone: string;
    is_online: boolean;
    last_seen: string;
  }>;
  count: number;
}

interface ChannelsResponse {
  channels: Array<{
    id: string;
    name: string;
    type: 'public' | 'group' | 'direct';
    created_at: string;
    members_count: number;
    messages_count: number;
  }>;
}

export const chatApi = {
  async registerUser(name: string, phone: string): Promise<RegisterUserResponse> {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register_user', name, phone })
    });
    return response.json();
  },

  async getMessages(channelId: string): Promise<MessagesResponse> {
    const response = await fetch(`${CHAT_API_URL}?action=messages&channel_id=${channelId}`);
    return response.json();
  },

  async sendMessage(data: { channel_id: string; user_id: number; content: string; message_type: string }) {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_message', ...data })
    });
    return response.json();
  },

  async updateOnlineStatus(userId: number, isOnline: boolean) {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_online', user_id: userId, is_online: isOnline })
    });
    return response.json();
  },

  async getOnlineUsers(): Promise<OnlineUsersResponse> {
    const response = await fetch(`${CHAT_API_URL}?action=online_users`);
    return response.json();
  },

  async getChannels(): Promise<ChannelsResponse> {
    const response = await fetch(`${CHAT_API_URL}?action=channels`);
    return response.json();
  }
};
