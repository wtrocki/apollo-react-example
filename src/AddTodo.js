import React from 'react';
import TextField from 'material-ui/TextField';
import { graphql } from 'react-apollo';
import { ADD_TODO } from './graphql';

const styles = {
  input: {
    fontSize: 20,
  },
  underlineStyle: {
    borderColor: '#e91e63'
  }
};

class AddTodo extends React.Component {
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
      this.props.addTodo(this.state.value);
      this.setState({ value: '' });
    }
  }

  render () {
    return (
      <div className="add-todo">
        <TextField
          hintText="Comment on today session"
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

const withAddTodo = graphql(ADD_TODO, {
  props: ({ ownProps, mutate }) => ({
    addTodo (text) {
      return mutate({
        variables: { text },
      })
    },
  }),
})

export default withAddTodo(AddTodo)