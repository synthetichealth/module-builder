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
        const spans_and_brs = []
        var anySpan = false
        let i = 0
        value.split("\n").map(line => {
            if(line.length > 0){
                anySpan = true
                spans_and_brs.push(<span key={i}>{line}</span>)
            }
          spans_and_brs.push(<br key={i+1} />)
          i += 2
        });

        spans_and_brs.pop() // remove last br tag
        if(!anySpan){
            spans_and_brs.length=0
            spans_and_brs.unshift(<span key="placeholder">{''}</span>)
        }
        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>{spans_and_brs}</span>;
    };
}