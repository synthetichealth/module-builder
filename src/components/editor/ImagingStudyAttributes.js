// @flow

import React, { Component } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

import type { Instance as InstanceType, Series as SeriesType } from '../../types/Attributes';

import { Code } from './Code';
import { ValueSet } from './ValueSet';
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
        {this.renderCodeOrValueSet()}
      </div>
    );
  }

  renderCodeOrValueSet() {
    let sop_class = this.props.sop_class;
    if (sop_class.system) {
      return (
        <div className='section'>
          Code <a className='editable-text' onClick={() => {this.props.onChange('sop_class')({val: {id: {url: '', display: ''}}})}}>Add ValueSet</a>
          <br />
          <Code code={sop_class} system={'DICOM-SOP'} onChange={this.props.onChange('sop_class')} />
        </div>
      );
    } else {
      return (
        <div className='section'>
          <a className='editable-text' onClick={() => {this.props.onChange('sop_class')({val: {id: null}}); this.props.onChange('sop_class')({val: {id: getTemplate("Type.Code.DicomSOP")}}); }}>Add Code</a> ValueSet
          <br />
          <ValueSet valueset={sop_class} onChange={this.props.onChange('sop_class')} />
        </div>
      );
    }
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
        {this.renderCodeOrValueSet(body_site, 'body_site', "SNOMED-CT", "Type.Code.Snomed")}
        <b>Modality:</b>
        {this.renderCodeOrValueSet(modality, 'modality', "DICOM-DCM", "Type.Code.DicomDCM")}
        <b>Instances:</b>
        <InstanceList instances={instances} onChange={this.props.onChange('instances')} />
      </div>
    )
  }

  renderCodeOrValueSet(attribute, attributeName, codeSystem, codeName) {
     if (attribute.system) {
       return (
         <div className='section'>
           Code <a className='editable-text' onClick={() => {this.props.onChange(attributeName)({val: {id: {url: '', display: ''}}})}}>Add ValueSet</a>
           <br />
           <Code code={attribute} system={codeSystem} onChange={this.props.onChange(attributeName)} />
         </div>
       );
     } else {
       return (
         <div className='section'>
           <a className='editable-text' onClick={() => {this.props.onChange(attributeName)({val: {id: null}}); this.props.onChange(attributeName)({val: {id: getTemplate(codeName)}}); }}>Add Code</a> ValueSet
           <br />
           <ValueSet valueset={attribute} onChange={this.props.onChange(attributeName)} />
         </div>
       );
     }
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
