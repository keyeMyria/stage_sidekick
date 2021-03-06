import React, {PropTypes} from 'react';
import {Button, Header, Icon, Image, Search, Table} from "semantic-ui-react";
import './Directory.scss'
import {inject, observer} from "mobx-react/index";
import {observable} from 'mobx'
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class Directory extends React.Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true
    this.props.resourceStore.loadRoles().then(() => this.loading = false)
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const {roles} = this.props.resourceStore
    return (
      <div className="main-content">
        <Header as="h2" dividing>
          Directory
        </Header>
        <div>
          <Button onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'roles', resourceId: null})}
                  primary>
            <Icon name="add user"/>
            Add User
          </Button>
        </div>
        <div>
          <Search
            loading={false}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            value=''
          />
        </div>
        <Table celled padded sortable selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone Number</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {roles.map((role, i) => {
              const user = role.user || {}
                return (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <Header as='h4'>
                        <Image id='avatar' avatar src={role.avatar}/>
                        <Header.Content>
                          {role.fullName}
                          <Header.Subheader>{role.title}</Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell>{role.department}</Table.Cell>
                    <Table.Cell>
                      {role.status}
                    </Table.Cell>
                    <Table.Cell><a href={`mailto:${user.email}`}>{user.email}</a></Table.Cell>
                    <Table.Cell>{user.phone_number}</Table.Cell>
                  </Table.Row>
                )
              },
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Directory
