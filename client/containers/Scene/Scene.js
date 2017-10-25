import React from 'react';
import {connect} from 'react-redux';
import './Scene.scss'
import {Dimmer, Grid, Header, Image, Loader, Tab,} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {fetchResource} from "../../api/actions"
import * as _ from "lodash";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import CommentFeed from "../../components/CommentFeed/CommentFeed";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {sceneId} = ownProps.params
  const scene = _.get(state.resources, `scenes.byId.${sceneId}`, {})
  const {
    roles: {byId: rolesById} = {},
    characters: {byId: charactersById} = {},
  } = state.resources
  return {
    dispatch,
    scene,
    rolesById,
    charactersById,
  }
})

export class Scene extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('scenes', `scenes/${this.props.params.sceneId}`))
    // TODO: being lazy here and getting all scenes/scenes even though we really only need some
    this.props.dispatch(fetchResource('characters', 'characters'))
    this.props.dispatch(fetchResource('roles', 'roles'))
  }

  renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed/></Tab.Pane>},
      {menuItem: 'Activity', render: () => <Tab.Pane><ActivityFeed/></Tab.Pane>},
    ]

    return (
      <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
    )
  }

  render() {
    const {scene, rolesById, charactersById} = this.props
    if (!charactersById || !rolesById || !charactersById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <Layout thisPage={this.props.route.name}>
        <div className="Scene">
          <Grid className="content-container">
            <Grid.Column>
              <Header as="h1">
                <Image shape='circular' src={_.get(scene, 'display_image.url')}/>
                {' '}{scene.title}
                <Header.Subheader>
                  {scene.setting}, {scene.length_in_minutes}m runtime
                </Header.Subheader>
              </Header>
              <Header as='h3' dividing>
                Description
              </Header>
              <p>
                {scene.description}
              </p>
              <Header as='h3' dividing>
                Characters
              </Header>

              <CardGroup resource={'scenes'}>
                {scene.character_ids.map((characterId, i) => {
                    const character = charactersById[characterId]
                    const characterRole = rolesById[character.role_ids[0]]
                    const characterImageUrl = character.display_image ? character.display_image.url : null
                    return (
                      <DisplayCard
                        cardImage={characterImageUrl}
                        header={character.name}
                        meta={`Played by ${characterRole.first_name} ${characterRole.last_name}`}
                        frontDescription={character.description}
                        label='Character'
                        key={`index-${i}`}
                        sortable={false}
                        index={i}
                      />
                    )
                  },
                )}
              </CardGroup>

              <Header as='h3' dividing>
                Activity
              </Header>
              {this.renderActivitySection()}
            </Grid.Column>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default Scene;
