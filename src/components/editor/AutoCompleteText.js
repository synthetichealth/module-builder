import React from 'react'
import './AutoCompleteText.css'

export default class AutoCompleteText extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            suggestions: [],
            text: this.props.text
        }
    }

    suggestionSelected (value) {
        this.props.onChange(value); 
        this.setState(() => ({
            suggestions: [],
        }));
    }

    renderSuggestions () {
        const { suggestions } = this.state;
        return (
            <ul>
                {suggestions.map((item, i) => <li key={i} onClick={() => this.suggestionSelected(item)}>{item}</li>)}
            </ul>)
    }

    onFocusGained = (e) => {
        let value =  e.target.value;
        const { items } = this.props;
        let suggestions = []
        if (!value.match(/^[a-z0-9'-_() ]*$/i) || value.indexOf('\\') !== -1 || value.indexOf('*') === 0)
        {
            suggestions = ['Invalid Input'];
        }
        else 
        {
            const regex = new RegExp (`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        
        this.setState (() => ({suggestions, text: value}));    
    }

    onSubmitted = (props) => {
        const timer = setTimeout(() => {
            let suggestions = [];
            this.setState (() => ({suggestions}))
            this.props.onBlur(props); 
          }, 250);
          return () => clearTimeout(timer);
        
    }

    handleChange(event) {
        const text = event.target.value;
        this.props.onChange(text); 
        const { items } = this.props;
        let suggestions = [];

            if (text.match(/^[a-z0-9'-_() ]*$/i) && text.indexOf('\\') === -1 && text.indexOf('*') !== 0)
            {
                const regex = new RegExp (`^${text.toString()}`, 'i');
                suggestions = items.sort().filter(v => regex.test(v));
            }
            else
            {
                suggestions = ['Invalid Input'];
            }
            
            this.setState (() => ({suggestions, text: text}));
      }

      keyPressed = (event) => {
        if (event.key === "Enter" ) {
            this.onSubmitted(true);
        }
        if (event.key === "Escape") {
            this.onSubmitted(false);
        }
      } 

    render () {
        return (
            <div className="AutoCompleteText" onBlur={this.onSubmitted} >
                <input value={this.props.text} onChange={this.handleChange} onFocus={this.onFocusGained} onKeyDown={this.keyPressed}  type="text" />
                {this.renderSuggestions()}
            </div>
        )
    }
}