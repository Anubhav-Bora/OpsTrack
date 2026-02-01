import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge, getRoleVariant } from "@/components/Common/Badge";
import { ROLE_LABELS } from "@/utils/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsers: User[];
  currentMembers: string[]; // userId list
  isLoading?: boolean;
  onAddMembers: (userIds: string[]) => void;
}

export function AddMemberModal({
  open,
  onOpenChange,
  availableUsers,
  currentMembers,
  isLoading,
  onAddMembers,
}: AddMemberModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = availableUsers.filter(
    (user) =>
      !currentMembers.includes(user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;
    onAddMembers(selectedUsers);
    setSelectedUsers([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members to Room</DialogTitle>
          <DialogDescription>
            Select users to add to this room
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search users</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {availableUsers.length === 0
                  ? "No users available"
                  : "No matching users found"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        id={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                      />
                      <label
                        htmlFor={user.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </label>
                    </div>
                    <Badge variant={getRoleVariant(user.role)}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedUsers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : "Add Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
