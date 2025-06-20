import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { formatDateLabel, shouldShowDateSeparator } from "./utils";

const MessagesList = ({ 
  messages, 
  currentUser, 
  hasNextPage, 
  fetchNextPage, 
  isFetchingNextPage 
}) => {
  const scrollRef = useRef(null);
  const [activeTimeId, setActiveTimeId] = useState(null);
  
  // Track state for proper infinite scroll behavior
  const isInitialLoad = useRef(true);
  const wasAtBottom = useRef(true);
  const lastMessageCount = useRef(0);
  const lastMessageId = useRef(null);
  const scrolledToBottomInitially = useRef(false);
  const isFetchingRef = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);
  const lastFetchScrollTop = useRef(0);

  // Messages come from backend in newest-first order, but we display oldest-first
  const sortedMessages = React.useMemo(() => {
    return [...messages].reverse(); // Reverse to show oldest first in chat
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
  };

  // Handle scroll events to track position and trigger infinite scroll
  const handleScroll = () => {
    console.log('🎯 handleScroll called', {
      hasScrollRef: !!scrollRef.current,
      scrolledToBottomInitially: scrolledToBottomInitially.current,
      isFetchingRef: isFetchingRef.current
    });
    
    if (!scrollRef.current || !scrolledToBottomInitially.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottomNow = scrollTop + clientHeight >= scrollHeight - 50;
    
    // Use a much more conservative threshold to prevent premature triggering
    const contentBasedThreshold = Math.min(150, clientHeight * 0.2);
    const isNearTop = scrollTop <= contentBasedThreshold;
    const scrollingUp = scrollTop < lastScrollTop.current;

    console.log('📊 Scroll position:', {
      scrollTop,
      scrollHeight,
      clientHeight,
      dynamicThreshold: contentBasedThreshold,
      isNearTop,
      scrollingUp,
      hasNextPage,
      isFetching: isFetchingRef.current,
      isFetchingNextPage
    });

    // Update position tracking
    wasAtBottom.current = isAtBottomNow;
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Throttle the scroll detection
    scrollTimeout.current = setTimeout(() => {
      // More intelligent conditions for infinite scroll
      const hasScrolledSignificantlyUp = lastScrollTop.current - scrollTop > 30;
      const isAtVeryTop = scrollTop <= 10;
      const notRecentlyFetched = lastFetchScrollTop.current === 0 || Math.abs(scrollTop - lastFetchScrollTop.current) > 100;
      
      const shouldTriggerFetch = isNearTop && 
        scrollingUp && 
        (hasScrolledSignificantlyUp || isAtVeryTop) && 
        notRecentlyFetched && 
        hasNextPage && 
        !isFetchingNextPage && 
        !isFetchingRef.current;

      if (shouldTriggerFetch) {
        console.log('🔍 Scroll trigger conditions met:', {
          isNearTop,
          scrollTop,
          scrollingUp,
          hasScrolledSignificantlyUp,
          isAtVeryTop,
          notRecentlyFetched,
          lastFetchPosition: lastFetchScrollTop.current,
          hasNextPage,
          isFetchingNextPage,
          isFetchingRef: isFetchingRef.current
        });
        lastFetchScrollTop.current = scrollTop;
        triggerFetchNextPage();
      } else {
        console.log('❌ Scroll trigger blocked:', {
          isNearTop,
          scrollingUp,
          hasScrolledSignificantlyUp,
          isAtVeryTop,
          notRecentlyFetched,
          lastFetchPosition: lastFetchScrollTop.current,
          hasNextPage,
          isFetchingNextPage,
          isFetchingRef: isFetchingRef.current,
          distance: Math.abs(scrollTop - lastFetchScrollTop.current)
        });
      }
    }, 100);

    // Update scroll position after all checks
    lastScrollTop.current = scrollTop;
  };

  // Separate function to handle the actual fetch logic
  const triggerFetchNextPage = () => {
    if (!scrollRef.current || isFetchingRef.current || !hasNextPage || isFetchingNextPage) {
      console.log('⚠️ Fetch blocked:', {
        noScrollRef: !scrollRef.current,
        isFetchingRef: isFetchingRef.current,
        hasNextPage,
        isFetchingNextPage
      });
      return;
    }

    console.log('🔄 Loading more messages (scroll-based)...', {
      scrollTop: scrollRef.current.scrollTop,
      hasNextPage,
      isFetchingNextPage,
      isFetchingRef: isFetchingRef.current,
      messagesCount: sortedMessages.length
    });

    isFetchingRef.current = true;
    
    // Store scroll position before fetch
    const previousScrollHeight = scrollRef.current.scrollHeight;
    const previousScrollTop = scrollRef.current.scrollTop;
    
    fetchNextPage()
      .then((result) => {
        console.log('📦 Fetch completed, result:', result);
        
        // Use a more reliable approach to maintain scroll position
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
            
            console.log('✅ More messages loaded, scroll position maintained', {
              previousHeight: previousScrollHeight,
              newHeight: newScrollHeight,
              addedHeight,
              newScrollTop: newScrollTop,
              finalScrollTop: scrollRef.current.scrollTop
            });
          } else {
            console.log('⚠️ No height added, possible duplicate fetch or no new messages');
          }
          
          // Reset fetch flag with shorter delay
          setTimeout(() => {
            isFetchingRef.current = false;
            console.log('🎯 Ready for next fetch after stabilization');
            
            // Ensure scroll handler is still working by logging current state
            if (scrollRef.current) {
              console.log('📊 Current scroll state after fetch:', {
                scrollTop: scrollRef.current.scrollTop,
                scrollHeight: scrollRef.current.scrollHeight,
                clientHeight: scrollRef.current.clientHeight,
                scrolledToBottomInitially: scrolledToBottomInitially.current,
                hasNextPage
              });
            }
          }, 25);
        };

        // Use multiple animation frames for better reliability
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(maintainScrollPosition);
          });
        });
      })
      .catch((error) => {
        console.error('❌ Error fetching next page:', error);
        isFetchingRef.current = false;
      });
  };

  // Handle initial load and new messages
  useEffect(() => {
    if (sortedMessages.length === 0) return;

    // Initial load - scroll to bottom
    if (isInitialLoad.current && sortedMessages.length > 0) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToBottom();
          scrolledToBottomInitially.current = true;
          lastMessageCount.current = sortedMessages.length;
          // Set initial last message ID
          if (sortedMessages.length > 0) {
            lastMessageId.current = sortedMessages[sortedMessages.length - 1].id;
          }
          isInitialLoad.current = false;
          console.log('Initial scroll to bottom completed', {
            messagesCount: sortedMessages.length,
            hasNextPage,
            isFetchingNextPage
          });
        }, 100);
      });
      return;
    }

    // Skip processing if we're currently fetching more pages to avoid scroll jumps
    if (isFetchingNextPage || isFetchingRef.current) {
      return;
    }

    // Check for new messages (not from pagination)
    const hasNewMessages = sortedMessages.length > lastMessageCount.current;
    
    if (hasNewMessages && scrolledToBottomInitially.current) {
      // Check if this is likely a real new message vs pagination
      const currentLastMessage = sortedMessages[sortedMessages.length - 1];
      const isReallyNewMessage = currentLastMessage && 
        currentLastMessage.id !== lastMessageId.current;
      
      if (isReallyNewMessage) {
        // Get the newest message
        const newestMessage = sortedMessages[sortedMessages.length - 1];
        const isOwnMessage = newestMessage && (
          newestMessage.sender_id === currentUser?.id ||
          newestMessage.sender_name === 'You' ||
          newestMessage.sender_name === currentUser?.username ||
          newestMessage.sender_name === `${currentUser?.first_name} ${currentUser?.last_name}`
        );

        // Auto-scroll only if user was at bottom or it's their own message
        if (wasAtBottom.current || isOwnMessage) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              scrollToBottom(true);
              console.log('Auto-scrolled for new message');
            }, 50);
          });
        }

        // Update last message ID
        lastMessageId.current = currentLastMessage.id;
      }
      
      // Update message count
      lastMessageCount.current = sortedMessages.length;
    }
  }, [sortedMessages.length, isFetchingNextPage, currentUser, hasNextPage]);

  // Debug effect to track hasNextPage changes
  useEffect(() => {
    console.log('📄 Pagination state changed:', {
      hasNextPage,
      isFetchingNextPage,
      messagesCount: sortedMessages.length,
      isFetchingRef: isFetchingRef.current
    });
  }, [hasNextPage, isFetchingNextPage, sortedMessages.length]);

  // Update message count when fetching completes
  useEffect(() => {
    if (!isFetchingNextPage && sortedMessages.length > 0) {
      lastMessageCount.current = sortedMessages.length;
    }
  }, [isFetchingNextPage, sortedMessages.length]);

  // Reset state when chat changes or messages array changes
  useEffect(() => {
    console.log('🔄 Resetting MessagesList state for new chat or messages');
    isInitialLoad.current = true;
    wasAtBottom.current = true;
    lastMessageCount.current = 0;
    lastMessageId.current = null;
    scrolledToBottomInitially.current = false;
    isFetchingRef.current = false;
    lastScrollTop.current = 0;
    lastFetchScrollTop.current = 0;
    
    // Clear any pending scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
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
