import React from 'react'
import Feedback from './Feedback'

export default class FeedbackList extends React.Component {


  renderFeedbacks () {
    const feedbacks = [...this.props.feedbacks];
    return feedbacks
      .reverse()
      .map(feedback =>
        <Feedback
          key={feedback.id}
          feedback={feedback}
          toggleFeedback={this.props.toggleFeedback}
        />
      )
  }

  render () {
    let feedbacks = null;
    if (this.props.feedbacks.length===0) {
      feedbacks = <div className="list message box">Ups! There are no feedback yet...</div>
    } else {
      feedbacks = <div className="list">{this.renderFeedbacks()}</div>
    }
    return (
      <div>{feedbacks}</div>
    )
  }
}