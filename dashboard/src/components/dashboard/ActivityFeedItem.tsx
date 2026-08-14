export interface ActivityFeedItemProps {
  actorInitials: string;
  text: string;
  timestamp: string;
}

const ActivityFeedItem = ({ actorInitials, text, timestamp }: ActivityFeedItemProps) => (
  <div className="flex items-start gap-3">
    <span className="w-7 h-7 rounded-full bg-accent text-primary text-[11px] font-semibold flex items-center justify-center shrink-0">
      {actorInitials}
    </span>
    <div className="min-w-0">
      <p className="text-sm text-foreground leading-snug">{text}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{timestamp}</p>
    </div>
  </div>
);

export default ActivityFeedItem;
