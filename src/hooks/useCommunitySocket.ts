import { useEffect } from 'react';
import { connectCommunitySocket, disconnectCommunitySocket } from '@/lib/socket';
import { recordTrialView } from '@/lib/community-api';
import { useCommunityStore, type CommunityMessage } from '@/store/community-store';

export function useCommunitySocket(
  token: string | null,
  enabled: boolean,
  onSubscriptionUpdate?: () => void
) {
  useEffect(() => {
    if (!enabled || !token) return;

    const socket = connectCommunitySocket(token);

    const onNew = async (payload: CommunityMessage) => {
      const state = useCommunityStore.getState();
      if (state.messages.some((m) => m.id === payload.id)) {
        return;
      }

      const sub = state.subscription;
      const isTopLevel = !payload.parentId;
      const isOwn = payload.userId === state.currentUserId;

      if (sub?.plan === 'trial' && isTopLevel && !isOwn) {
        if (sub.viewLimitReached || (sub.viewsRemaining ?? 0) <= 0) {
          return;
        }
        try {
          const { allowed, data } = await recordTrialView(token, payload.id);
          useCommunityStore.getState().setSubscription(data);
          onSubscriptionUpdate?.();
          if (!allowed) {
            return;
          }
          useCommunityStore.getState().prependMessage(payload);
          return;
        } catch (e) {
          console.error('Trial view record failed:', e);
          return;
        }
      }

      useCommunityStore.getState().prependMessage(payload);
    };

    const onUpdated = (payload: CommunityMessage) => {
      useCommunityStore.getState().updateMessage(payload);
    };

    const onDeleted = ({ id, parentId }: { id: string; parentId: string | null }) => {
      useCommunityStore.getState().removeMessage(id, parentId);
    };

    const onLike = (payload: { id: string; likesCount: number }) => {
      const state = useCommunityStore.getState();
      const msg =
        state.messages.find((m) => m.id === payload.id) ||
        Object.values(state.repliesByParent)
          .flat()
          .find((m) => m.id === payload.id);
      state.updateLike(payload.id, payload.likesCount, msg?.likedByMe ?? false);
    };

    const onReply = ({
      parentId,
      reply,
    }: {
      parentId: string;
      reply: CommunityMessage;
      replyCount?: number;
    }) => {
      useCommunityStore.getState().addReply(parentId, reply);
    };

    socket.on('message:new', onNew);
    socket.on('message:updated', onUpdated);
    socket.on('message:deleted', onDeleted);
    socket.on('message:like', onLike);
    socket.on('message:reply', onReply);

    return () => {
      socket.off('message:new', onNew);
      socket.off('message:updated', onUpdated);
      socket.off('message:deleted', onDeleted);
      socket.off('message:like', onLike);
      socket.off('message:reply', onReply);
    };
  }, [enabled, token, onSubscriptionUpdate]);

  useEffect(() => {
    if (!enabled) {
      disconnectCommunitySocket();
    }
  }, [enabled]);
}
