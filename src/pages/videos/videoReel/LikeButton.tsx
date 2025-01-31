import React from "react";
import { contentLike, isContentLiked } from "../../../services/content";
import { TopIcon } from "./TopIcon";

interface LikeButtonProps {
  programId: string;
  subject: string;
  contentId: string;
  userId: string;
}

export default React.memo((playerPayload: LikeButtonProps) => {
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!playerPayload?.programId) return;
      try {
        if (playerPayload?.contentId) {
          const response = await isContentLiked(playerPayload);
          if (response && response[0]?.like !== undefined) {
            setIsLiked(response[0]?.like || false);
          }
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [playerPayload]);

  const handleLikeToggle = async () => {
    try {
      const likeStatus = !isLiked;
      const payloadWithLikeStatus = {
        ...playerPayload,
        like: likeStatus,
      };
      await contentLike(payloadWithLikeStatus);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <TopIcon
      onClick={handleLikeToggle}
      icon={!isLiked ? "ThumbsUpIconFilled" : "ThumbsUpIcon"}
      right="16px"
      _hover={{ bg: "#FFFFFF26" }}
      _active={{ bg: "#FFFFFF26" }}
    />
  );
});
