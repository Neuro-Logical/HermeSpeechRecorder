import React from 'react'
import { Button } from 'semantic-ui-react'

const ScriptController = ({previousLine, nextLine, start, stop, pause, save, restart, review, nextContent, reviewState, recordingState, currentLine}) => (
  <div className="center">
    {/* <Button content='Back' onClick={previousLine}/> */}
    {/* <Button labelPosition='left' icon='left chevron' content='Back' onClick={previousLine}/> */}
    {!reviewState && recordingState !== 'start' && <Button icon='play' content='Start Recording' onClick={start}/>}
    {reviewState && renderReviewStateButtons(restart, nextLine, save)}
    {!reviewState && currentLine !== 0 && <Button content={"Stop"} onClick={review}></Button>}
  </div>
)

const renderReviewStateButtons = (restart, nextLine, save) => {
  return (
    <div>
      {renderRerecordButton(restart)} 
      {nextLine && renderNextButton(nextLine)}
      {save && renderSaveButton(save)}
    </div>
  )
}

const renderRerecordButton = (restart) => {
  return (
    <Button class="ui primary basic button" onClick={restart}>
      <i class="microphone icon"/>
      Re-record
    </Button>
  )
}

const renderNextButton = (nextLine) => {
  return (
    <Button class="ui positive basic button" content={"Move Onto Next Line"} onClick={nextLine}/>
  )
}

const renderSaveButton = (save) => {
  return (
    <Button class="ui positive basic button" content={"Save"} onClick={save}/>
  )
}

export default ScriptController