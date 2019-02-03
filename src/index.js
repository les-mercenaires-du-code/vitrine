import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './form.scss';
import './input.scss';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    }
  }

  focused() {
    this.setState({focused:true});
  }

  focusedOut() {
    this.setState({focused:false});
    this.props.validate();
  }

  render() {
    this.inputClass = 'beautify-it'
    this.inputClass += this.state.focused ? ' is-focused' : '';
    this.inputClass += this.props.isValid ? ' is-valid' : '';

    return (
      <p className={this.inputClass}>
        <input
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.name}
          onFocus={() => this.focused()}
          onBlur={() => this.focusedOut()}
        />

        <i className={`fas ${this.props.fa}`}/>
      </p>
    )
  }
}

const validMap = {
  date: (content) => {
    return content.length > 0;
  },
  titre: (content) => {
    return content.length > 0;
  },
  prixHT: (content) => {
    return true;
  },
  prixTTC: (content) => {
    return true;
  },
  tauxTVA: (content) => {
    return true;
  },
  valeurTVA: (content) => {
    return true;
  },
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: false,
      titre: false,
      prixHT: false,
      prixTTC: false,
      tauxTVA: false,
      valeurTVA: false,
    }
  }

  validate(name) {
    const content = document.querySelector(`input[name='${name}']`).value;
    const state = this.state;
    state[name] =  validMap[name](content);
    this.setState(state);
  }

  createInput(type, name, placeholder, fa) {
    return (
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        fa={fa}
        validate={() => this.validate(name)}
        isValid={this.state[name]}
      />
    )
  }

  createInput(type, name, placeholder, fa) {
    render() {
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        fa={fa}
        validate={() => this.validate(name)}
        isValid={this.state[name]}
      />
    }
  }

  render() {
    return (
      <section className="add-pro-bill">
        <header className="add-pro-bill-header">
          <h1 className="add-pro-bill-header-title">
            <i className="fas fa-plus"></i>
            nouveau frais pro
          </h1>
        </header>
        <div className="add-pro-bill-content">
          <div className="add-pro-bill-container global">
            {this.createInput('date', 'date', 'Date', 'fa-calendar-check');}
            {this.createInput('text', 'titre', 'Titre', 'fa-certificate');}
          </div>

          <div className="add-pro-bill-container price">
            {this.createInput('number', 'prixHT', 'Prix HT (€)', 'fa-money-bill');}
            {this.createInput('number', 'prixTTC', 'Prix TTC (€)', 'fa-money-bill');}
          </div>

          <div className="add-pro-bill-container tva">
            {this.createInput('number', 'tauxTVA', 'Taux TVA (%)', 'fa-money-bill');}
            {this.createInput('number', 'valeurTVA', 'Valeur TVA (€)', 'fa-money-bill');}
          </div>
        </div>
        <footer className="add-pro-bill-footer">
          <a className="btn btn-primary" href="">ajouter un nouveau</a>
          <a className="btn btn-primary" href="">retour à la liste</a>
        </footer>
      </section>
    )
  }
}


ReactDOM.render(
  <Form/>,
  document.getElementById('root')
);
