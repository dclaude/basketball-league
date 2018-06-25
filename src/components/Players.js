import React from 'react'
import { Route, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getPlayers } from '../api'
import { parse } from 'query-string'
import slug from 'slug'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default class Players extends React.Component {
  state = {
    players: [],
    loading: true,
  }
  fetchPlayers = (teamId) => {
    getPlayers(teamId)
      .then((players) => this.setState(() => ({
        loading: false,
        players,
      })))
  }
  componentDidMount () {
    const { location } = this.props
    /*
    the <Players> component can be used for different routes (all palyers, players of a team, ...)
    - if there is 'query strings' in location.search (it mean that we are in the route 'players of a team')
    then parse it with query-string and retrieve the 'teamId'
    and then only fetch the users of this team
    - otherwise fetch all the players
    */
    location.search
      ? this.fetchPlayers(parse(location.search).teamId)
      : this.fetchPlayers()
  }
  render () {
    const { players, loading } = this.state
    const { location, match } = this.props
    return (
      <div className='container two-column'>
        <Sidebar
          loading={loading}
          title='Players'
          list={players.map((player) => player.name)}
          {...this.props}
        />

      { /*
        main part of the view
        if the app is not 'loading' and if a player has not been selected yet 
        (i.e. route is exactly '/players' and not for instance '/players/Tyler-McGinnis')
        then render the 'Select a Player' message
        */
        loading === false && location.pathname === '/players'
            ? <div className='sidebar-instruction'>Select a Player</div>
            : null}

        <Route path={`${match.path}/:playerId`} render={({ match }) => {
          // if players ar still loading do not render anything
          if (loading === true) return null
          // on utilise le URL parameter match.params.playerId pour trouver le player
          const {
            name, position, teamId, number, avatar, apg, ppg, rpg, spg
          } = players.find((player) => slug(player.name) === match.params.playerId)
          return (

            <TransitionGroup className='panel'>
              <CSSTransition key={location.key} classNames='fade' timeout={500}>
                <div className='panel'>
                  <img className='avatar' src={`${avatar}`} alt={`${name}'s avatar`} />
                  <h1 className='medium-header'>{name}</h1>
                  <h3 className='header'>#{number}</h3>
                  <div className='row'>
                    <ul className='info-list' style={{marginRight: 80}}>
                      <li>Team
                        <div>
                          <Link style={{color: '#68809a'}} to={`/${teamId}`}>
                            {teamId[0].toUpperCase() + teamId.slice(1)}
                          </Link>
                        </div>
                      </li>
                      <li>Position<div>{position}</div></li>
                      <li>PPG<div>{ppg}</div></li>
                    </ul>
                    <ul className='info-list'>
                      <li>APG<div>{apg}</div></li>
                      <li>SPG<div>{spg}</div></li>
                      <li>RPG<div>{rpg}</div></li>
                    </ul>
                  </div>
                </div>
              </CSSTransition>
            </TransitionGroup>
          )
        }} />

        </div>
    )
  }
}

