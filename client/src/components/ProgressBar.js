import ProgressBar from 'react-bootstrap/ProgressBar';

function renderProgressBar({current, total}) {
    console.log("current/total: ", current, total)
    // return <div className='progress_bar'> <ProgressBar animated now={current} max={total} visuallyHidden variant="info"/> </div>;
    return <ProgressBar animated now={current} max={total} visuallyHidden variant="info"/>;
}

export default renderProgressBar;