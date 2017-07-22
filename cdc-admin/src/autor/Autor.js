import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import FormularioAutor from './FormularioAutor';
import TabelaAutores from './TabelaAutor';

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: "json",
            success: (resultado) => {
                resultado = resultado.slice(resultado.length - 5, resultado.length);
                this.setState({ lista: resultado });
            }
        });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
            this.setState({ lista: novaLista });
        });

    }

    atualizaListagem(novaLista) {
        this.setState({ lista: novaLista });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }

}