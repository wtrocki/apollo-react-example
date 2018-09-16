import React from 'react'
import { graphql } from 'react-apollo';
import { FEEDBACKS, VOTE_FEEDBACK } from './graphql';

const styles = {
  votes: {
    textAlign: 'right'
  },
};

class Feedback extends React.Component {

  state = {
    votes: this.props.feedback.votes,
  }

  componentWillReceiveProps(nextProps) {
    this.setState((state) => {
      return {
        votes: nextProps.feedback.votes,
      };
    });
  }

  updateCheck() {
    this.props.toggleFeedback(this.props.feedback.id, this.state.votes)
    this.setState((state) => {
      return {
        votes: state.votes + 1,
      };
    });
  }

  render() {
    return (
      <div className="container" onClick={this.updateCheck.bind(this)}>
        <div className="box message">{this.props.feedback.text}</div>
        <div style={styles.votes}>{"(votes:" + this.props.feedback.votes + ")"}
        </div>
      </div>
    )
  }
}

const withToggleFeedback = graphql(VOTE_FEEDBACK, {
  props: ({ ownProps, mutate }) => ({
    toggleFeedback(id, votes) {
      return mutate({
        variables: { id, votes },
        update: (store, { data: { updateFeedback } }) => {
          const data = store.readQuery({ query: FEEDBACKS });
          data.allFeedbacks.map(t => {
            if (t.id === updateFeedback.id) {
              return {
                id: updateFeedback.id,
                text: t.text,
                votes: updateFeedback.votes
              }
            }
            return t;
          });
          store.writeQuery({ query: FEEDBACKS, data });
        },
      })
    },
  }),
})

export default withToggleFeedback(Feedback)