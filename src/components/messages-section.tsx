import React from "react";
import { MessageCard } from "@/components/message-card";
import { UserResult } from "@/services/linkd-api";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

interface MessagesSectionProps {
  profiles: UserResult[];
  generatedMessages: Record<string, string>;
  onMessageChange: (profileId: string, message: string) => void;
  onRegenerateMessage: (profileId: string) => Promise<void>;
  onSendAll: () => Promise<void>;
  isSendingMessages: boolean;
}

export function MessagesSection({
  profiles,
  generatedMessages,
  onMessageChange,
  onRegenerateMessage,
  onSendAll,
  isSendingMessages,
}: MessagesSectionProps) {

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Generated Outreach Messages</h2>
        <p className="text-muted-foreground mt-2">
          Here are the personalized messages for each contact
        </p>
        
        <div className="mt-4 flex items-center justify-center">
          <Button
            onClick={onSendAll}
            disabled={isSendingMessages || profiles.length === 0}
            className="px-6 py-3 text-lg flex items-center gap-2"
          >
            <Linkedin size={20} />
            {isSendingMessages ? "Sending..." : "Send All Messages"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {profiles.map((profile, index) => (
          <MessageCard
            key={`${profile.profile.id}-${index}`}
            profile={profile}
            message={generatedMessages[`${profile.profile.id}-${index}`] || generatedMessages[profile.profile.id] || ""}
            onMessageChange={(message) => onMessageChange(profile.profile.id, message)}
            onRegenerateMessage={() => onRegenerateMessage(profile.profile.id)}
          />
        ))}
      </div>
    </div>
  );
} 