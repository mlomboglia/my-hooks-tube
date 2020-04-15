import React from "react";

import VideoPreview from "../VideoPreview/VideoPreview";
import NextUpVideo from "./NextUpVideo/NextUpVideo";
import "./RelatedVideos.scss";

const RelatedVideos = (props) => {

  if (!props.videos || !props.videos.length) {
    return <div className="related-videos" />;
  }

  // safe because before we check if the array has at least one element
  const nextUpVideo = props.videos[0];
  const remainingVideos = props.videos.slice(1);

  const relatedVideosPreviews = remainingVideos.map((relatedVideo) => (
    <VideoPreview
      video={relatedVideo}
      key={relatedVideo.id}
      pathname="/watch"
      search={`?v=${relatedVideo.id}`}
      horizontal={true}
    />
  ));

  console.log(relatedVideosPreviews);

  return (
    <div className="related-videos">
      <NextUpVideo video={nextUpVideo} />
      {relatedVideosPreviews}
    </div>
  );
};

export default RelatedVideos;
