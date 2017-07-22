import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros';

export default class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    salvaAlteracao(nomeInput, evento) {
        this.setState({ [nomeInput]: evento.target.value });
    }

    enviaForm(evento) {
        evento.preventDefault();
        console.log("dados enviados");

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            contentType: "application/json",
            dataType: "json",
            type: "post",
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: (novaLista) => {
                novaLista = novaLista.slice(novaLista.length - 5, novaLista.length);
                PubSub.publish('atualiza-lista-autores', novaLista);
                this.setState({ nome: '', email: '', senha: '' });
            },
            error: (erro) => {
                if (erro.status === 400) {
                    new TratadorErros().publicaErros(erro.responseJSON);
                }
            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post" >

                    <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')} />
                    <InputCustomizado id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')} />
                    <InputCustomizado id="senha" label="Senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')} />

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}