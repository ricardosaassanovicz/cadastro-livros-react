import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros';

export default class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    salvaAlteracao(nomeInput, evento) {
        this.setState({ [nomeInput]: evento.target.value });
    }

    enviaForm(evento) {
        evento.preventDefault();
        console.log("dados enviados");

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: "application/json",
            dataType: "json",
            type: "post",
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: (novaLista) => {
                novaLista = novaLista.slice(novaLista.length - 5, novaLista.length);
                PubSub.publish('atualiza-lista-livros', novaLista);
                this.setState({ titulo: '', preco: '', autorId: '' });
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

                    <InputCustomizado id="titulo" label="Titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this, 'titulo')} />
                    <InputCustomizado id="preco" label="Preco" type="text" name="preco" value={this.state.preco} onChange={this.salvaAlteracao.bind(this, 'preco')} />

                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.salvaAlteracao.bind(this, 'autorId')}>
                            <option value=""> Selecione um autor</option>
                            {
                                this.props.autores.map((autor) => {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                })
                            }

                        </select>
                    </div>

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}