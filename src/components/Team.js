import React from 'react'
import PropTypes from 'prop-types'
import { getTeam } from '../api'

export default class Team extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
  }
  state = {
    team: null,
  }
  fetchTeam = (id) => {
    this.setState(() => ({ team: null }))
    getTeam(id)
      .then((team) => this.setState(() => ({ team })))
  }
  componentDidMount() {
    this.fetchTeam(this.props.id)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) { // the user clicked on a new team in the sidebar of the teams view 
      this.fetchTeam(nextProps.id)
    }
  }
  render() {
    return this.props.children(this.state.team)
  }
} 

