import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import FormularioLivro from './FormularioLivro';
import TabelaLivros from './TabelaLivro';

export default class Livro extends Component {

    constructor() {
        super();
        this.state = { lista: [], autores: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: "json",
            success: (resultado) => {
                resultado = resultado.slice(resultado.length - 5, resultado.length);
                this.setState({ lista: resultado });
            }
        });

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: "json",
            success: (resultado) => {
                resultado = resultado.slice(resultado.length - 5, resultado.length);
                this.setState({ autores: resultado });
            }
        });

        PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
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
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista} />

                </div>
            </div>
        )
    }

}



