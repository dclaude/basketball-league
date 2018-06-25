import React from 'react'

export default class DynamicImport extends React.Component {
  state = {
    component: null
  }
  componentWillMount() {
    this.props.load()
      .then((mod) => this.setState(() => ({
        component: mod.default // change state to trigger a re-render
      })))
  }
  render() {
    // when state changes, it triggers a re-render and the loaded module is notified to the props.children callback
    return this.props.children(this.state.component)
  }
} 

