import React from 'react';
import TextField from 'material-ui/TextField';
import { graphql } from 'react-apollo';
import { ADD_FEEDBACK } from './graphql';

const styles = {
  input: {
    fontSize: 20,
  },
  underlineStyle: {
    borderColor: '#e91e63'
  }
};

class AddFeedback extends React.Component {
  state = {
    value: '',
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.addFeedback(this.state.value);
      this.setState({ value: '' });
    }
  }

  render () {
    return (
      <div className="add-feedback">
        <TextField
          hintText="Any Questions or Comments?"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
          style={styles.input}
          underlineFocusStyle={styles.underlineStyle}
        />
      </div>
    )
  }
}

const withAddFeedback = graphql(ADD_FEEDBACK, {
  props: ({ ownProps, mutate }) => ({
    addFeedback (text) {
      return mutate({
        variables: { text },
      })
    },
  }),
})

export default withAddFeedback(AddFeedback)