import React, { useState } from "react";
import "./VideoInfoBox.scss";
import { Image, Button, Divider } from "semantic-ui-react";
import Linkify from "react-linkify";
import {getPublishedAtDateString} from '../../shared/date-format';
import {getShortNumberString} from '../../shared/number-format';

const VideoInfoBox = (props) => {

  const {channel} = props;
  const [isCollapsed, setIsCollapsed] = useState(true);

  const onToggleCollapseButtonClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!props.video || !props.channel) {
    return <div/>;
  }

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

  const getSubscriberButtonText = () => {
    const parsedSubscriberCount = Number(channel.statistics.subscriberCount);
    const subscriberCount = getShortNumberString(parsedSubscriberCount);
    return `Subscribe ${subscriberCount}`;
  }

  const buttonText = getSubscriberButtonText();
  const channelThumbnail = channel.snippet.thumbnails.medium.url;
  const channelTitle = channel.snippet.title;
  const publishedAtString = getPublishedAtDateString(props.video.snippet.publishedAt);
  const descriptionParagraphs = getDescriptionParagraphs();
  const {descriptionTextClass, buttonTitle} = getConfig();

  return (
    <div>
        <div className='video-info-box'>
          <Image className='channel-image' src={channelThumbnail} circular/>
          <div className="video-info">
            <div className='channel-name'>{channelTitle}</div>
            <div className='video-publication-date'>{publishedAtString}</div>
          </div>
          <Button color='youtube'>{buttonText}</Button>
          <div className="video-description">
            <div className={descriptionTextClass}>
              {descriptionParagraphs}
            </div>
            <Button compact onClick={onToggleCollapseButtonClick}>{buttonTitle}</Button>
          </div>
        </div>
        <Divider/>
      </div>
  );
};

export default VideoInfoBox;
