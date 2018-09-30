import React, { Component } from 'react';

import { graphql } from 'react-apollo';

import AddFeedback from './AddFeedback';
import FeedbackList from './FeedbackList';
import Footer from './Footer';
import Logos from './Logos';

import {Card} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';

import ReactCardFlip from 'react-card-flip';
import { FEEDBACKS, FEEDBACK_SUBSCRIPTION } from './graphql';

import './App.css';

const styles = {
  tabs: {
    backgroundColor: 'white',
  },
  tab: {
    fontSize: 20,
    textTransform: 'initial',
    fontWeight: 400,
  },
  button: {
    color: 'rgba(0, 0, 0, 0.54)',
    borderBottom: '1px solid #eee',
    marginBottom: '-1px'
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 24,
  }
};

class App extends Component {

  state = {
    isFlipped: false,
  };

  handleClick(e) {
    e.preventDefault();
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  componentWillMount() {
    this.props.subscribeToNewFeedbacks()
  }

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped}>
        <Card className="card" key="front">
          <div className="header" onClick={this.handleClick.bind(this)}>
          Feedback App<FontIcon className="material-icons" style={styles.icon}>info</FontIcon>
          </div>
          <AddFeedback addFeedback={this.props.addFeedback}/>
          
          {this.props.loading &&
            <CircularProgress size={80} thickness={5} />
          }
          <div className="turn" style={{ opacity: this.state.isFlipped?'0':'1' }}>
            <FeedbackList
              feedbacks={this.props.feedbacks || []}
              toggleFeedback={this.props.toggleFeedback}
            />
          </div>
          <Footer/>
        </Card>
        <Card className="card" key="back">
          <div className="header" onClick={this.handleClick.bind(this)}>
            Info<FontIcon className="material-icons" style={styles.icon}>info</FontIcon>
          </div>
          <div className="message"> Made with Love using </div>
          <Logos/>
          <div className="empty"></div>
          <Footer/>
        </Card>
      </ReactCardFlip>
    );
  }
}

const withFeedbacks = graphql(
  FEEDBACKS,
  {
    props: ({ ownProps, data }) => {
      if (data.loading) return { loading: true }
      if (data.error) return { hasErrors: true }
      return {
        feedbacks: data.allFeedbacks,
      }
    },
  }
)

const withSubscription = graphql(FEEDBACKS,
  {
    props: ({ data: { subscribeToMore } }) => ({
      subscribeToNewFeedbacks() {
        return subscribeToMore({
          document: FEEDBACK_SUBSCRIPTION,
          updateQuery: (state, { subscriptionData }) => {
            let feedbacks, t;
            const {mutation, node} = t = subscriptionData.data.Feedback;
  
            switch(mutation) {
              case "CREATED": 
              case "UPDATED":
                let exists = false;
                // UPDATE
                feedbacks = state.allFeedbacks.map(feedback => {
                  // covers updates and new feedbacks
                  // created by this client
                  if(feedback.id === node.id) {
                    exists = true;
                    return {
                      id: node.id,
                      text: node.text,
                      votes: node.votes,
                      __typename: "Feedback"
                    }
                  }
                  return feedback;
                })
                // NEWLY CREATED (other clients)
                if (!exists) {
                  feedbacks.push({
                    id: node.id,
                    text: node.text,
                    votes: node.votes,
                    __typename: "Feedback"
                  });                
                }
                break;
              case "DELETED": 
                feedbacks = state.allFeedbacks
                  .filter(feedback => feedback.id !== t.previousValues.id);
                break;
              default: break;
            }
  
            return {
              allFeedbacks: feedbacks
            }
          },
        })
      },
    }),
  },
)

export default withFeedbacks(withSubscription(App))