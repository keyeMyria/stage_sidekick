import {computed, extendObservable, observable, transaction} from 'mobx'
import {get, isString, remove} from 'lodash'
import {RESOURCES} from "../constants";

export class BaseModel {

  modified = false // this can probably be computed?

  @computed get main_image() {
    if (isString(this._display_image)) {
      return this._display_image
    } else {
      return get(this, '_display_image.url')
    }
  }

  constructor(store, field_names, resource) {
    this.store = store
    this.field_names = field_names
    this.resource = resource

    this.save = this.save.bind(this)
    this.asJson = this.asJson.bind(this)
    this._initializeFields = this._initializeFields.bind(this)
  }

  _initializeFields() {
    let resource = this
    for (const [field, default_value] of Object.entries(this.field_names)) {
      extendObservable(resource, {[`_${field}`]: default_value})
      Object.defineProperty(resource, field, {
        get: function () {
          return resource[`_${field}`]
        },
        set: function (newValue) {
          if (resource[`orig_${field}`] === undefined) {
            resource[`orig_${field}`] = resource[`_${field}`]
            resource.modified = true
          }
          resource[`_${field}`] = newValue
        }
      })
    }
  }

  updateFromObject(attributes) {
    transaction(() => {
      Object.keys(this.field_names).forEach(field => {
        this[`_${field}`] = attributes[field]
      })
    })
  }

  asJson(modifiedOnly = true) {
    let json = {}
    Object.keys(this.field_names).forEach(field => {
      if (modifiedOnly) {
        if (this[`orig_${field}`] !== undefined && this[`_${field}`] !== this[`orig_${field}`]) {
          json[field] = this[`_${field}`]
        }
      } else {
        json[field] = this[`_${field}`]
      }
    })
    return json
  }

  revert() {
    Object.keys(this.field_names).forEach(field => {
      if (this[`orig_${field}`]) {
        this[`_${field}`] = this[`orig_${field}`]
      }
    })
  }

  save() {
    let method = 'POST'
    let apiEndpoint = RESOURCES[this.resource].apiEndpoint

    if (this.id) {
      method = 'PUT'
      apiEndpoint += `/${this.id}`
    }
    let payload = this.asJson(true)
    if (_.isEmpty(payload)) return

    this.store._api(apiEndpoint, method, payload).then(
      response => {
        // I know it says forEach but the response will always have a single value in a hash
        Object.values(response[this.resource].byId).forEach(json => this.updateFromObject(json))
        if (method === 'POST') {
          this.store[this.resource].push(this)
        }
        // Clean up staged resource reference
        const resourceObj = RESOURCES[this.resource]
        this.store[`${resourceObj.singularized}Staged`] = undefined
        this.modified = false
      })
  }

  destroy() {
    const method = 'delete'
    const apiEndpoint = RESOURCES[this.resource].apiEndpoint + `/${this.id}`

    this.store._api(apiEndpoint, method)
    remove(this.store[this.resource], (n) => n.id === this.id)

  }
}