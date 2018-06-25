import React from 'react'
import { Route, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getTeamNames } from '../api'
import TeamLogo from './TeamLogo'
import Team from './Team'
import Loading from './Loading'

export default class Teams extends React.Component {
  state = {
    teamNames: [],
    loading: true,
  }
  componentDidMount () {
    getTeamNames()
      .then((teamNames) => {
        this.setState(() => ({
          loading: false,
          teamNames,
        }))
      })
  }
  render () {
    const { loading, teamNames } = this.state
    const { location, match } = this.props
    return (
      <div className='container two-column'>
        <Sidebar
          loading={loading}
          title='Teams'
          list={teamNames}
          {...this.props}
        />

        {loading === false && location.pathname === '/teams'
          ? <div className='sidebar-instruction'>Select a Team</div>
          : null
        }

        <Route path={`${match.path}/:teamId`} render={({ match }) => (
          <div className='panel'>
            <Team id={match.params.teamId}>
              {(team) => team === null
                ? <Loading />
                : <div style={{width: '100%'}}>
                    <TeamLogo id={team.id} className='center' />
                    <h1 className='medium-header'>{team.name}</h1>
                    <ul className='info-list row'>
                      <li>Established<div>{team.established}</div></li>
                      <li>Manager<div>{team.manager}</div></li>
                      <li>Coach<div>{team.coach}</div></li>
                    </ul>
                    <Link
                      className='center btn-main'
                      to={`/${team.id}`}>
                        {team.name} Team Page
                    </Link>
                  </div>}
            </Team>
          </div>
        )} />

      </div>
    )
  }
}

