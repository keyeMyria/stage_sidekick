import React from 'react';
import './ScriptImport.scss'
import {Button, Form, Grid, Icon, Input,} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import ContentLoader from "components/ContentLoader/ContentLoader";
import CandidateSelection from "containers/ScriptImport/CandidateSelection";

@inject("resourceStore", "uiStore") @observer
export class ScriptImport extends React.Component {

  processUpload(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.resourceStore.parseScript({payload: reader.result, format: 'pdf'})
    }

    reader.readAsDataURL(file)
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const {scriptOptions} = this.props.resourceStore

    return (
      <Grid className="ScriptImport">
        <Grid.Column>
          <h4>Import Script</h4>
          Choose one of the following import options:

          <Form>
            <Form.Field>
              <Button as="label" htmlFor="file" primary>
                <Icon name='upload'/>
                Upload PDF
                <Input
                  type="file"
                  id="file"
                  onChange={(e) => this.processUpload(e)}
                  style={{display: 'none'}}
                />
              </Button>
            </Form.Field>
          </Form>

          {scriptOptions && <CandidateSelection />}

        </Grid.Column>
      </Grid>
    );
  }
}

export default ScriptImport;
