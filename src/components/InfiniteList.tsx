import React, { useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteListProps {
  children: React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  className?: string;
  isLoading: boolean;
  threshold?: number;
  loadingComponent?: React.ReactNode;
  reverse?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function InfiniteList({
  children,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  isLoading,
  className = "",
  threshold = 100,
  loadingComponent,
  reverse = false,
  containerRef: externalRef,
}: InfiniteListProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef || internalRef;
  const prevScrollHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (reverse) {
      if (scrollTop < threshold) {
        isLoadingMoreRef.current = true;
        prevScrollHeightRef.current = scrollHeight;
        prevScrollTopRef.current = scrollTop;
        fetchNextPage();
      }
    } else {
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        fetchNextPage();
      }
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold,
    reverse,
    containerRef,
  ]);

  useEffect(() => {
    if (reverse && !isFetchingNextPage && isLoadingMoreRef.current) {
      const element = containerRef.current;
      if (element) {
        const newScrollHeight = element.scrollHeight;
        const heightDifference = newScrollHeight - prevScrollHeightRef.current;

        if (heightDifference > 0) {
          element.scrollTop = prevScrollTopRef.current + heightDifference - 100;
        }

        isLoadingMoreRef.current = false;
      }
    }
  }, [isFetchingNextPage, reverse, containerRef]);

  const checkAndFetchIfNeeded = useCallback(() => {
    if (!containerRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollHeight, clientHeight } = containerRef.current;

    if (!reverse && scrollHeight <= clientHeight + 10) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, reverse, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = handleScroll;
    container.addEventListener("scroll", scrollHandler);
    return () => container.removeEventListener("scroll", scrollHandler);
  }, [handleScroll, containerRef]);

  useEffect(() => {
    if (!reverse) {
      const timer = setTimeout(checkAndFetchIfNeeded, 300);
      return () => clearTimeout(timer);
    }
  }, [children, hasNextPage, checkAndFetchIfNeeded, reverse]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !reverse) {
      const timer = setTimeout(checkAndFetchIfNeeded, 500);
      return () => clearTimeout(timer);
    }
  }, [hasNextPage, isFetchingNextPage, checkAndFetchIfNeeded, reverse]);

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-2 h-10">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
    </div>
  );

  const showLoadingAtTop = reverse;
  const showLoadingAtBottom = !reverse;

  const content = (
    <>
      {isFetchingNextPage &&
        showLoadingAtTop &&
        (loadingComponent || defaultLoadingComponent)}
      {children}
      {isFetchingNextPage &&
        showLoadingAtBottom &&
        (loadingComponent || defaultLoadingComponent)}
    </>
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (externalRef) {
    return content;
  }

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {content}
    </div>
  );
}

export default InfiniteList;
