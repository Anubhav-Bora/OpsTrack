import { MoreHorizontal, Shield, Crown, User as UserIcon, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoomMember, UserRole } from "@/types";
import { Badge, getRoleVariant } from "@/components/Common/Badge";
import { ROLE_LABELS } from "@/utils/constants";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MembersListProps {
  members: RoomMember[];
  onPromote?: (memberId: string) => void;
  onDemote?: (memberId: string) => void;
  onRemove?: (memberId: string) => void;
  isLoading?: boolean;
}

export function MembersList({
  members,
  onPromote,
  onDemote,
  onRemove,
  isLoading,
}: MembersListProps) {
  const { user } = useAuth();
  
  // Check if current user is admin in THIS room
  const currentUserMembership = members.find((m) => m.userId === user?.id);
  const isRoomAdmin = currentUserMembership?.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
            <div className="h-10 w-10 skeleton rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members in this room yet.
      </div>
    );
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return Shield;
      case "LEADER":
        return Crown;
      default:
        return UserIcon;
    }
  };

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const RoleIcon = getRoleIcon(member.role);
        const isCurrentUser = member.userId === user?.id;
        const canManage = isRoomAdmin && !isCurrentUser && member.role !== "ADMIN";

        return (
          <div
            key={member.id}
            className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-card transition-colors hover:bg-secondary/30"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">
                    {member.user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {member.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={getRoleVariant(member.role)}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {ROLE_LABELS[member.role]}
              </Badge>

              {canManage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.role !== "LEADER" && onPromote && (
                      <DropdownMenuItem onClick={() => onPromote(member.id)}>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Promote to Leader
                      </DropdownMenuItem>
                    )}
                    {member.role === "LEADER" && onDemote && (
                      <DropdownMenuItem onClick={() => onDemote(member.id)}>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Demote to Member
                      </DropdownMenuItem>
                    )}
                    {onRemove && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onRemove(member.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from Room
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
