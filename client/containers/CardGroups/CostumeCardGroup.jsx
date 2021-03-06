import React from 'react';
import {inject, observer} from "mobx-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";
import ContentLoader from "components/ContentLoader/ContentLoader";
import {computed, observable} from "mobx";

@inject("resourceStore", "uiStore") @observer
export class CostumeCardGroup extends React.Component {

  @observable loading = true

  componentDidMount() {
    Promise.all([
      this.props.resourceStore.loadCostumes()
    ]).then(() => this.loading = false)
  }

  @computed get costumes() {
    const {costumeIds, resourceStore} = this.props

    if (costumeIds) {
      return resourceStore.costumes.filter(costume => costumeIds.includes(costume.id))
    } else {
      return resourceStore.costumes
    }
  }


  handleEditCostume = (event, costume) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'costumes', resourceId: costume.id})
  }

  handleDestroyCostume = (event, costume) => {
    event.preventDefault()
    costume.destroy()
  }

  generateCardExtra = (costume) => {
    const num_scenes = costume.sceneIds.length
    const num_characters = costume.characterIds.length
    let sentence = ''
    if (num_scenes > 0 && num_characters > 0) {
      sentence = `Worn in ${num_scenes} ${num_scenes > 1 ? 'scenes' : 'scene'} by ${num_characters} ${num_characters > 1 ? 'characters' : 'character'}`
    }
    else if (num_scenes > 0) {
      sentence = `Worn in ${num_scenes} ${num_scenes > 1 ? 'scenes' : 'scene'}`
    }
    else if (num_characters > 0) {
      sentence = `Worn by ${num_characters} ${num_characters > 1 ? 'characters' : 'character'}`
    }
    else {
      sentence = ''
    }
    return (
      <p style={{textAlign: 'center'}}>{sentence}</p>
    )
  }

  render() {
    const {uiStore: {showResourceSidebar}} = this.props

    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <CardGroup resource='costumes'>
        {this.costumes.map((costume, i) => {
            return (
              <DisplayCard
                cardImage={costume.cardImage}
                showEditBar
                header={costume.title}
                frontDescription={costume.description}
                extra={this.generateCardExtra(costume)}
                onEditCallback={(event) => this.handleEditCostume(event, costume)}
                onDeleteCallback={(event) => this.handleDestroyCostume(event, costume)}
                label='Costume'
                key={`index-${i}`}
                onClick={() => showResourceSidebar('costumes', costume.id)}
                sortable={false}
                index={i}
              />
            )}
        )}
      </CardGroup>
    )
  }
}
