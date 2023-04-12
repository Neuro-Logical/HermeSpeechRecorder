import React from 'react'
import AudioPlayer from './AudioPlayer';

function ReviewPage(audioData) {
  return (
    <><div className='review_recording'>Please Review Your Recording</div><AudioPlayer source={audioData}></AudioPlayer></>
  )
}

export default ReviewPage