import React, { useState } from "react";
import "./VideoInfoBox.scss";
import { Image, Button } from "semantic-ui-react";

const VideoInfoBox = props => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const onToggleCollapseButtonClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  let descriptionTextClass = "collapsed";
  let buttonTitle = "Show More";
  if (!isCollapsed) {
    descriptionTextClass = "expanded";
    buttonTitle = "Show Less";
  }

  return (
    <div className="video-info-box">
      <Image
        className="channel-image"
        src="http://via.placeholder.com/48x48"
        circular
      />
      <div className="video-info">
        <div className="channel-name">Channel Name</div>
        <div className="video-publication-date">Thu 24, 2017</div>
      </div>
      <Button color="youtube">91.5K Subscribe</Button>
      <div className="video-description">
        <div className={descriptionTextClass}>descriptionParagraphs</div>
        <Button compact onClick={onToggleCollapseButtonClick}>
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfoBox;
