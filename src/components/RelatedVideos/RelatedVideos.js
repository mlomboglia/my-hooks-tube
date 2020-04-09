import React from "react";

import VideoPreview from "../VideoPreview/VideoPreview";
import NextUpVideo from "./NextUpVideo/NextUpVideo";
import "./RelatedVideos.scss";

const relatedVideos = () => {
  return (
    <div className="related-videos">
      <NextUpVideo />
      <VideoPreview horizontal={true} />
      <VideoPreview horizontal={true} />
      <VideoPreview horizontal={true} />
    </div>
  );
};

export default relatedVideos;
