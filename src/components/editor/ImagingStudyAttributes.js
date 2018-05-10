// @flow

import React, { Component } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

import type { Instance as InstanceType, Series as SeriesType } from '../../types/Attributes';

import { Code } from './Code';
import { getTemplate } from '../../templates/Templates';

type InstanceProps = {
  title: string,
  sop_class: CodeType,
  onChange: any
}

export class Instance extends Component<InstanceProps> {

  render() {
    let title = this.props.title;
    let sop_class = this.props.sop_class;
    return (
      <div>
        Title: <RIEInput className='editable-text' value={title} propName="title" change={this.props.onChange('title')} />
        <br />
        <br />
        <b>SOP Class:</b>
        <br />
        <Code code={sop_class} system={"DICOM-SOP"} onChange={this.props.onChange('sop_class')} />
      </div>
    );
  }

}

type InstanceListProps = {
  instances: InstanceType[],
  onChange: any
}

export class InstanceList extends Component<InstanceListProps> {

  render() {
    if (!this.props.instances) {
      return null;
    }
    return (
      <div>
        {this.props.instances.map((instance, i) => {
          return (
            <div className='section' key={i}>
              <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <Instance onChange={this.props.onChange(i)} title={instance.title} sop_class={instance.sop_class}/>
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.instances.length}]`)({val: {id: getTemplate('Attribute.ImagingStudy.Instance')}})}>+</a>
      </div>
    );
  }

}

type SeriesProps = {
  body_site: CodeType,
  modality: CodeType,
  instances: InstanceType[],
  onChange: any
}

export class Series extends Component<SeriesProps> {

  render() {
    let body_site = this.props.body_site;
    let modality = this.props.modality;
    let instances = this.props.instances;
    return (
      <div className='section'>
        <b>Body Site:</b>
        <br />
        <Code code={body_site} system={"SNOMED-CT"} onChange={this.props.onChange('body_site')} />
        <br/>
        <b>Modality:</b>
        <br />
        <Code code={modality} system={"DICOM-DCM"} onChange={this.props.onChange('modality')} />
        <br />
        <b>Instances:</b>
        <InstanceList instances={instances} onChange={this.props.onChange('instances')} />
      </div>
    )
  }

}


type SeriesListProps = {
  series: SeriesType[],
  onChange: any
}

export class SeriesList extends Component<SeriesListProps> {

  render() {
    if (!this.props.series) {
      return null;
    }
    return (
      <div>
        {this.props.series.map((series, i) => {
          return (
            <div className='section' key={i}>
                <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
                <br />
                <Series onChange={this.props.onChange(i)} body_site={series.body_site} modality={series.modality} instances={series.instances} />
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.series.length}]`)({val: {id: getTemplate('Attribute.ImagingStudy.Series')}})}>+</a>
      </div>
    );
  }

}
