import React from 'react';
import ReactDOM from 'react-dom';
import RIEStatefulBase from 'riek/lib/RIEStatefulBase';
export default class TextArea extends RIEStatefulBase {
    keyDown = (event) => {
        if (event.keyCode === 27) { this.cancelEditing() }     // Escape
    };

    renderEditingComponent = () => {
        return <textarea
            rows={this.props.rows}
            cols={this.props.cols}
            disabled={this.state.loading}
            className={this.makeClassString()}
            defaultValue={this.props.value}
            onInput={this.textChanged}
            onBlur={this.finishEditing}
            ref="input"
            onKeyDown={this.keyDown}
            {...this.props.editProps} />;
    };

    renderNormalComponent = () => {
        const value = this.state.newValue || this.props.value
        const spansAndBrs = []

        // The regex just replaces whitespace (tabs, newline, space) 
        // to check if the remarks section only has whitespace in it.
        if(!value.replace(/\s/g,"").length){
            spansAndBrs.push(<div key="placeholder">{this.props.defaultText}</div>)
        }else{
            value.split("\n").forEach(line => {
                spansAndBrs.push(<div key={spansAndBrs.length}>{line}</div>)       
            });
        }

        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>{spansAndBrs}</span>;
    };
}