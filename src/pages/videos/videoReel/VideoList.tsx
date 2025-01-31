import { FixedSizeList as List } from "react-window";
import VideoItem from "./VideoItem";
import React, { memo } from "react";

export default memo(
  ({
    width,
    itemSize,
    videos,
    programID,
    authUser,
    visibleIndex,
    isIndexScroll,
    qmlRef,
    listRef,
    handleScroll,
  }: {
    width: number;
    itemSize: number;
    videos: any[];
    programID: string | undefined;
    authUser: any;
    visibleIndex: number;
    isIndexScroll: boolean;
    qmlRef: React.RefObject<HTMLDivElement>;
    listRef: React.RefObject<HTMLDivElement>;
    handleScroll: () => void;
  }) => {
    return (
      <List
        overscanCount={1}
        ref={listRef}
        width={width}
        height={itemSize}
        itemCount={videos.length}
        itemSize={itemSize}
        scrollToIndex={visibleIndex}
        onScroll={handleScroll}
        style={{
          scrollSnapType: "y mandatory",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapStop: "always",
          scrollBehavior: "smooth",
          touchAction: "none",
        }}
        className="hide-scrollbar"
      >
        {({ index, style }: { index: number; style: React.CSSProperties }) => (
          <VideoItem
            programID={programID}
            subject={videos?.[index]?.subject}
            id={videos?.[index]?.contentId}
            qml_id={videos?.[index]?.lesson_questionset}
            isVisible={isIndexScroll && index === visibleIndex}
            refQml={qmlRef}
            style={style}
            adapter={videos?.[index]?.contentSource}
            key={"VideoItem" + index}
            authUser={authUser}
            thumbnailUrl={videos?.[index]?.thumbnailUrl}
          />
        )}
      </List>
    );
  }
);
