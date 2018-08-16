import React from 'react';
import ReactDOM from 'react-dom';
import RIEStatefulBase from 'riek/lib/RIEStatefulBase';
export default class TextArea extends RIEStatefulBase {
    keyDown = (event) => {
        if (event.keyCode === 27) { this.cancelEditing() }     // Escape
    };

    renderEditingComponent = () => {
        var toggle = false;

        const uneditedRemarks = this.props.value.split("\n").reduce(((p,d,i)=>{
            if(d.length>0){
                toggle = true;
              return [...p,d];
            }else if(toggle){
                toggle=false;
                return [...p];
            }else{
                return [...p,d]

            }
          }),[]).join("\n");

        return <textarea
            rows={this.props.rows}
            cols={this.props.cols}
            disabled={this.state.loading}
            className={this.makeClassString()}
            defaultValue={uneditedRemarks}
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
            let aggregateLine = "";
            const lines = this.props.value.split("\n");
            lines.forEach(line => {
                if(line.length===0){
                    // Empty lines get turned into new lines
                    spansAndBrs.push(<div key={spansAndBrs.length}>{aggregateLine}</div>)
                    aggregateLine = "";       
                }
                aggregateLine += line;      
            });

            if(aggregateLine.length > 0){
                // Push the final aggregate line
                spansAndBrs.push(<div key={spansAndBrs.length}>{aggregateLine}</div>)
            }

        }

        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>{spansAndBrs}</span>;
    };
}