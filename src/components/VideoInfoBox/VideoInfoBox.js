import React, { useState } from "react";
import "./VideoInfoBox.scss";
import { Image, Button } from "semantic-ui-react";
import Linkify from "react-linkify";
import {getPublishedAtDateString} from '../../shared/date-format';

const VideoInfoBox = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const onToggleCollapseButtonClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getDescriptionParagraphs = () => {
    const videoDescription = props.video.snippet
      ? props.video.snippet.description
      : null;
    if (!videoDescription) {
      return null;
    }
    return videoDescription.split("\n").map((paragraph, index) => (
      <p key={index}>
        <Linkify>{paragraph}</Linkify>
      </p>
    ));
  };

  const getConfig = () => {
    let descriptionTextClass = "collapsed";
    let buttonTitle = "Show More";
    if (!isCollapsed) {
      descriptionTextClass = "expanded";
      buttonTitle = "Show Less";
    }
    return { descriptionTextClass, buttonTitle};
  };

  const publishedAtString = getPublishedAtDateString(props.video.snippet.publishedAt);
  const descriptionParagraphs = getDescriptionParagraphs();
  const {descriptionTextClass, buttonTitle} = getConfig();

  return (
    <div className="video-info-box">
      <Image
        className="channel-image"
        src="http://via.placeholder.com/48x48"
        circular
      />
      <div className="video-info">
        <div className="channel-name">Channel Name</div>
        <div className="video-publication-date">{publishedAtString}</div>
      </div>
      <Button color="youtube">91.5K Subscribe</Button>
      <div className="video-description">
        <div className={descriptionTextClass}>{descriptionParagraphs}</div>
        <Button compact onClick={onToggleCollapseButtonClick}>
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfoBox;
