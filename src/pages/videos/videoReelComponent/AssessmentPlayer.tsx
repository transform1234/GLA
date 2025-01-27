import React, { useState, useRef, useMemo, useCallback } from "react";
import { VStack, HStack, Badge, Box } from "@chakra-ui/react";
import SunbirdPlayer from "../../../components/players/SunbirdPlayer";
import CustomSkeleton from "./CustomSkeleton";
import CustomHeading from "../../../components/common/typography/Heading";
import StarRating from "../../../components/common/input/Rating";
import PrimaryButton from "../../../components/common/button/PrimaryButton";
import IconByName from "../../../components/common/icons/Icon";
import * as content from "../../../services/content";
import { TopIcon } from "./TopIcon";

const VITE_PLAYER_URL = import.meta.env.VITE_PLAYER_URL;
const TELEMETRYBATCH = import.meta.env.VITE_TELEMETRYBATCH || 20;

interface AssessmentPlayerProps {
  qml_id: string;
  videoEndId: { qml_id?: string };
  adapter: string;
  lessonQml: { subject?: string | string[]; mimeType: string };
  heightPerItem: { width: number; height: number };
  setHeightPerItem: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
  isQUMLLoading: boolean;
  setIsQUMLLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
  refQml: React.RefObject<HTMLDivElement>;
  programID: string;
  authUser: { userId: string };
  updateCdataTag: (tags: any[], context: any) => any;
  playerContext: any;
  width: number;
  height: number;
}

const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({
  qml_id,
  videoEndId,
  lessonQml,
  heightPerItem,
  setHeightPerItem,
  isQUMLLoading,
  setIsQUMLLoading,
  isVisible,
  refQml,
  programID,
  authUser,
  updateCdataTag,
  playerContext,
  adapter,
  width,
  height,
}) => {
  const [rating, setRating] = useState(0);
  const subjectRef = useRef<HTMLDivElement>(null);

  const handleTopIconClick = useCallback(() => {
    if (heightPerItem?.height === 0) {
      setHeightPerItem({
        height: height / 2.5,
        width: width - 31,
      });
    } else {
      setHeightPerItem({ height: 0, width: 0 });
    }
    if (!isQUMLLoading) {
      setIsQUMLLoading(true);
    }
  }, [
    height,
    width,
    heightPerItem,
    isQUMLLoading,
    setHeightPerItem,
    setIsQUMLLoading,
  ]);

  const handleRatingSubmit = useCallback(async () => {
    const result = await content.rateQuiz({
      programId: programID,
      subject: Array.isArray(lessonQml?.subject)
        ? (lessonQml.subject as string[])[0]
        : lessonQml?.subject,
      userId: authUser.userId,
      assessmentId: videoEndId?.qml_id,
      rating: rating,
    });
    if (result) {
      setRating(100);
    }
  }, [programID, lessonQml, authUser.userId, videoEndId, rating]);

  return (
    qml_id && (
      <VStack bg="red.100">
        {lessonQml?.subject && (
          <HStack
            ref={subjectRef}
            spacing={1}
            visibility={heightPerItem?.height === 0 ? "hidden" : "visible"}
            opacity={heightPerItem?.height === 0 ? "0" : "1"}
            position={"absolute"}
            zIndex={20}
            right={
              heightPerItem?.width === 0
                ? "0px"
                : `${
                    heightPerItem?.width -
                    (subjectRef?.current?.clientWidth || 0)
                  }px`
            }
            bottom={
              heightPerItem?.height === 0
                ? "32px"
                : `${heightPerItem?.height - 74}`
            }
            transition="right 0.5s,bottom 0.5s"
            top="auto"
          >
            {Array.isArray(lessonQml?.subject) ? (
              lessonQml.subject.map((sub) => (
                <Badge
                  key={sub}
                  p="2px"
                  fontSize="12px"
                  fontWeight={500}
                  color="#03627C"
                  bg="#03627C33"
                >
                  {sub}
                </Badge>
              ))
            ) : (
              <Badge
                p="2px"
                fontSize="12px"
                fontWeight={500}
                color="#03627C"
                bg="#03627C33"
              >
                {lessonQml?.subject}
              </Badge>
            )}
          </HStack>
        )}
        <TopIcon
          onClick={handleTopIconClick}
          {...(heightPerItem?.height === 0
            ? {
                rounded: "none",
                roundedLeft: "full",
              }
            : {})}
          size={heightPerItem?.height === 0 ? "lg" : "sm"}
          _icon={{
            width: heightPerItem?.height === 0 ? "100%" : "",
            height: "",
            fontWeight: "600",
            color: "primary.500",
          }}
          p={heightPerItem?.height === 0 ? "5px 16px" : ""}
          icon={
            heightPerItem?.height === 0 ? "TakeAQuizIcon" : "ChevronDownIcon"
          }
          bg={heightPerItem?.width === 0 ? "white" : "#03627C1A"}
          right={heightPerItem?.width === 0 ? "0px" : `${32}px`}
          bottom={
            heightPerItem?.height === 0
              ? "32px"
              : `${heightPerItem?.height - 82}`
          }
          transition="right 0.5s,bottom 0.5s"
          top="auto"
        />
        {isQUMLLoading &&
          (videoEndId?.qml_id === qml_id ? (
            <Box
              pt={"52px"}
              bg={"transparent"}
              {...heightPerItem}
              {...{
                position: "absolute",
                bottom: "16px",
                transition: "right 0.5s,width 0.5s, height 0.5s",
                right: "16px",
              }}
            >
              <VStack
                p={heightPerItem?.height === 0 ? "0px" : "4"}
                pt={heightPerItem?.height === 0 ? "0px" : "44px"}
                bg={"white"}
                ref={isVisible ? refQml : null}
                rounded={"16px"}
                height={"100%"}
                textAlign={"center"}
                spacing={2}
                color={"darkBlue.500"}
                overflowY={"scroll"}
                justifyContent="center"
              >
                {rating < 100 ? (
                  <VStack spacing={2} width={"100%"}>
                    <CustomHeading
                      fontSize={"24px"}
                      fontWeight={"700"}
                      fontFamily={"Bebas Neue"}
                      color={"darkBlue.500"}
                      id="quiz-title"
                    >
                      CONGRATULATIONS!
                    </CustomHeading>
                    <VStack spacing={1}>
                      <CustomHeading
                        id="quiz-subtitle"
                        fontSize={"14px"}
                        fontWeight={"500"}
                        color={"darkBlue.500"}
                      >
                        You've completed the quiz!
                      </CustomHeading>
                      <CustomHeading
                        fontSize={"14px"}
                        fontWeight={"500"}
                        color={"darkBlue.500"}
                        id="rating-text"
                        display={"none"}
                      >
                        and you have earned
                        <span id="rating-point" style={{ padding: "0 5px" }}>
                          Loding.
                        </span>
                        coins.
                      </CustomHeading>
                    </VStack>
                    <VStack
                      bg="white"
                      id="rating-box"
                      display={"none"}
                      position={width < 412 ? "sticky" : "relative"}
                      bottom={width < 412 ? "0px" : "auto"}
                      spacing={width < 412 ? "1" : 4}
                      width={"100%"}
                    >
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        hStackProps={{ id: "rating-start", spacing: 4 }}
                      />
                      <PrimaryButton
                        size={width < 412 ? "sm" : "md"}
                        width={"100%"}
                        id="rating-button"
                        isDisabled={rating === 0}
                        onClick={handleRatingSubmit}
                      >
                        Submit
                      </PrimaryButton>
                    </VStack>
                  </VStack>
                ) : (
                  <VStack spacing={6}>
                    <IconByName
                      boxSize={"48px"}
                      name={"FamilyStarIcon"}
                      color={"yellow.lightDark"}
                    />
                    <VStack spacing={3}>
                      <CustomHeading
                        fontSize={"24px"}
                        fontWeight={"700"}
                        fontFamily={"Bebas Neue"}
                        color={"darkBlue.500"}
                      >
                        Thank you for your feedback!
                      </CustomHeading>
                      <CustomHeading
                        id="quiz-subtitle"
                        fontSize={"14px"}
                        fontWeight={"500"}
                        color={"darkBlue.500"}
                      >
                        Your feedback is valuable to us
                      </CustomHeading>
                    </VStack>
                  </VStack>
                )}
              </VStack>
            </Box>
          ) : (
            <SunbirdPlayer
              LoaderComponent={({ display }: any) => (
                <CustomSkeleton display={display} type="assessment" />
              )}
              forwardedRef={isVisible ? refQml : null}
              style={{ border: "none", borderRadius: "16px" }}
              _vstack={{
                position: "absolute",
                bottom: "16px",
                transition: "right 0.5s,width 0.5s, height 0.5s",
                right: "16px",
              }}
              {...heightPerItem}
              {...{ ...lessonQml, iframeId: "assessment" }}
              userData={{
                firstName: localStorage.getItem("name") || "",
                lastName: "",
              }}
              public_url={VITE_PLAYER_URL}
              adapter={adapter} // replace with actual adapter
              playerContext={updateCdataTag(
                [
                  {
                    id: qml_id,
                    type: "learning_content",
                  },
                  {
                    id: lessonQml?.mimeType,
                    type: "mimeType",
                  },
                ],
                playerContext
              )}
              batchsize={TELEMETRYBATCH}
            />
          ))}
      </VStack>
    )
  );
};

export default React.memo(AssessmentPlayer);
