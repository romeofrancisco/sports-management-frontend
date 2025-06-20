import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { formatDateLabel, shouldShowDateSeparator } from "./utils";

const MessagesList = ({ 
  messages, 
  currentUser, 
  hasNextPage, 
  fetchNextPage, 
  isFetchingNextPage 
}) => {  const scrollRef = useRef(null);
  const [activeTimeId, setActiveTimeId] = useState(null);
  
  // Track state for infinite scroll behavior
  const isInitialLoad = useRef(true);
  const wasAtBottom = useRef(true);
  const lastMessageCount = useRef(0);
  const lastMessageId = useRef(null);
  const scrolledToBottomInitially = useRef(false);
  const isFetchingRef = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);
  const lastFetchScrollTop = useRef(0);

  // Messages come from backend in newest-first order, display oldest-first
  const sortedMessages = React.useMemo(() => {
    return [...messages].reverse();
  }, [messages]);
  // Function to scroll to bottom smoothly
  const scrollToBottom = (smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };
  // Check if user is at the bottom
  const isAtBottom = () => {
    if (!scrollRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollTop + clientHeight >= scrollHeight - 50;
  };  // Handle scroll events to track position and trigger infinite scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    // Enable scroll handling if we have messages but flag isn't set
    if (!scrolledToBottomInitially.current && sortedMessages.length > 0) {
      scrolledToBottomInitially.current = true;
      isInitialLoad.current = false;
    }
    
    if (!scrolledToBottomInitially.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottomNow = scrollTop + clientHeight >= scrollHeight - 50;
    const contentBasedThreshold = Math.min(150, clientHeight * 0.2);
    const isNearTop = scrollTop <= contentBasedThreshold;
    const scrollingUp = scrollTop < lastScrollTop.current;

    // Update position tracking
    wasAtBottom.current = isAtBottomNow;
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Throttle scroll detection
    scrollTimeout.current = setTimeout(() => {
      const hasScrolledSignificantlyUp = lastScrollTop.current - scrollTop > 30;
      const isAtVeryTop = scrollTop <= 10;
      const notRecentlyFetched = lastFetchScrollTop.current === 0 || 
        Math.abs(scrollTop - lastFetchScrollTop.current) > 100;
      
      const shouldTriggerFetch = isNearTop && 
        scrollingUp && 
        (hasScrolledSignificantlyUp || isAtVeryTop) &&
        notRecentlyFetched &&
        hasNextPage && 
        !isFetchingNextPage && 
        !isFetchingRef.current;

      if (shouldTriggerFetch) {
        lastFetchScrollTop.current = scrollTop;
        triggerFetchNextPage();
      }
    }, 100);

    lastScrollTop.current = scrollTop;
  };
  // Separate function to handle the actual fetch logic
  const triggerFetchNextPage = () => {
    if (!scrollRef.current || isFetchingRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    isFetchingRef.current = true;
    
    // Store scroll position before fetch
    const previousScrollHeight = scrollRef.current.scrollHeight;
    const previousScrollTop = scrollRef.current.scrollTop;
    
    fetchNextPage()
      .then(() => {
        // Maintain scroll position after new messages are added
        const maintainScrollPosition = () => {
          if (!scrollRef.current) {
            isFetchingRef.current = false;
            return;
          }

          const newScrollHeight = scrollRef.current.scrollHeight;
          const addedHeight = newScrollHeight - previousScrollHeight;

          if (addedHeight > 0) {
            // Adjust scroll position to maintain current view
            const newScrollTop = previousScrollTop + addedHeight;
            scrollRef.current.scrollTop = newScrollTop;
          }
          
          // Reset fetch flag
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 25);
        };

        // Use animation frames for reliable scroll position adjustment
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(maintainScrollPosition);
          });
        });
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  };  // Handle initial load and new messages
  useEffect(() => {
    if (sortedMessages.length === 0) return;

    // Initial load - scroll to bottom
    if (isInitialLoad.current && sortedMessages.length > 0) {
      // Set flags immediately to enable scroll handling
      scrolledToBottomInitially.current = true;
      isInitialLoad.current = false;
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToBottom();
          lastMessageCount.current = sortedMessages.length;
          if (sortedMessages.length > 0) {
            lastMessageId.current = sortedMessages[sortedMessages.length - 1].id;
          }
        }, 50);
      });
      return;
    }

    // Skip processing if currently fetching to avoid scroll jumps
    if (isFetchingNextPage || isFetchingRef.current) {
      return;
    }

    // Check for new messages (not from pagination)
    const hasNewMessages = sortedMessages.length > lastMessageCount.current;
    
    if (hasNewMessages && scrolledToBottomInitially.current) {
      const currentLastMessage = sortedMessages[sortedMessages.length - 1];
      const isReallyNewMessage = currentLastMessage && 
        currentLastMessage.id !== lastMessageId.current;
      
      if (isReallyNewMessage) {
        const newestMessage = sortedMessages[sortedMessages.length - 1];
        const isOwnMessage = newestMessage && (
          newestMessage.sender_id === currentUser?.id ||
          newestMessage.sender_name === 'You' ||
          newestMessage.sender_name === currentUser?.username ||
          newestMessage.sender_name === `${currentUser?.first_name} ${currentUser?.last_name}`
        );

        // Auto-scroll if user was at bottom or it's their own message
        if (wasAtBottom.current || isOwnMessage) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              scrollToBottom(true);
            }, 50);
          });
        }

        lastMessageId.current = currentLastMessage.id;
      }
      
      lastMessageCount.current = sortedMessages.length;
    }
  }, [sortedMessages.length, isFetchingNextPage, currentUser, hasNextPage]);
  // Update message count when fetching completes
  useEffect(() => {
    if (!isFetchingNextPage && sortedMessages.length > 0) {
      lastMessageCount.current = sortedMessages.length;
    }
  }, [isFetchingNextPage, sortedMessages.length]);

  // Reset state when chat changes or messages array changes
  useEffect(() => {
    isInitialLoad.current = true;
    wasAtBottom.current = true;
    lastMessageCount.current = 0;
    lastMessageId.current = null;
    scrolledToBottomInitially.current = false;
    isFetchingRef.current = false;
    lastScrollTop.current = 0;
    lastFetchScrollTop.current = 0;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
    
    // Enable scroll handling for existing messages after brief delay
    if (sortedMessages.length > 0) {
      setTimeout(() => {
        if (!isInitialLoad.current) {
          scrolledToBottomInitially.current = true;
        }
      }, 200);
    }
  }, [messages]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {/* Loading indicator for fetching older messages */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-xs text-muted-foreground">Loading older messages...</span>
          </div>
        </div>
      )}

      {sortedMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        </div>
      ) : (
        sortedMessages.map((message, index) => {
          const prevMessage = sortedMessages[index - 1];
          const showDate = shouldShowDateSeparator(message, prevMessage);

          return (
            <ChatMessage
              key={message.id}
              message={message}
              currentUser={currentUser}
              showDate={showDate}
              dateLabel={formatDateLabel(message.timestamp)}
              activeTimeId={activeTimeId}
              setActiveTimeId={setActiveTimeId}
            />
          );
        })
      )}
    </div>
  );
};

export default MessagesList;