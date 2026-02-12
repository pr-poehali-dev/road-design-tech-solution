import { useState } from 'react';
import ClientHuntingHeader from '@/components/client-hunting/ClientHuntingHeader';
import ClientHuntingSections from '@/components/client-hunting/ClientHuntingSections';
import ClientHuntingTest from '@/components/client-hunting/ClientHuntingTest';

export default function ClientHunting() {
  const [selectedAudience, setSelectedAudience] = useState<number | null>(null);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ClientHuntingHeader />
      
      <ClientHuntingSections
        selectedAudience={selectedAudience}
        setSelectedAudience={setSelectedAudience}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
      
      <ClientHuntingTest />
    </div>
  );
}
