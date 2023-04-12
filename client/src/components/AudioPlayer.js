import React from 'react'
import ReactAudioPlayer from 'react-audio-player';

function AudioPlayer({source}) {
  return (
    <ReactAudioPlayer src={source}></ReactAudioPlayer>
  )
}

export default AudioPlayer