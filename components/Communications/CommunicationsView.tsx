import React, { useState } from 'react';
import DialogList from './DialogList';
import ChatView from './ChatView';
import ThreadView from './ThreadView';
import QueueView from './QueueView';
import { MOCK_CONVERSATIONS, MOCK_UNASSIGNED } from '../../constants';
import { ClientConversation, ChatMessage } from '../../types';

export type CommSubView = 'LIST' | 'CHAT' | 'THREAD' | 'QUEUE';

interface CommunicationsViewProps {
  onExit?: () => void;
}

const CommunicationsView: React.FC<CommunicationsViewProps> = ({ onExit }) => {
  const [subView, setSubView] = useState<CommSubView>('LIST');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const selectedConversation = MOCK_CONVERSATIONS.find(c => c.clientId === selectedClientId);
  
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSubView('CHAT');
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setSubView('THREAD');
  };

  const handleBack = () => {
    if (subView === 'THREAD') {
      setSubView('CHAT');
      setSelectedThreadId(null);
    } else if (subView === 'CHAT' || subView === 'QUEUE') {
      setSubView('LIST');
      setSelectedClientId(null);
    } else if (subView === 'LIST' && onExit) {
      onExit();
    }
  };

  return (
    <div className="flex h-full bg-[#F3F4F6] overflow-hidden relative">
      {subView === 'LIST' && (
        <DialogList 
          conversations={MOCK_CONVERSATIONS} 
          unassigned={MOCK_UNASSIGNED}
          onSelectClient={handleSelectClient}
          onOpenQueue={() => setSubView('QUEUE')}
          onBack={onExit}
        />
      )}

      {subView === 'CHAT' && selectedConversation && (
        <ChatView 
          conversation={selectedConversation} 
          onBack={handleBack}
          onSelectThread={handleSelectThread}
        />
      )}

      {subView === 'THREAD' && selectedConversation && selectedThreadId && (
        <ThreadView 
          conversation={selectedConversation}
          threadId={selectedThreadId}
          onBack={handleBack}
        />
      )}

      {subView === 'QUEUE' && (
        <QueueView 
          unassigned={MOCK_UNASSIGNED}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CommunicationsView;
