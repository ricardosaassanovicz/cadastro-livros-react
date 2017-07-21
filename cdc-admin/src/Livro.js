import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.titulo = this.setTitulo.bind(this);
        this.preco = this.setPreco.bind(this);
        this.autorId = this.setAutorId.bind(this);

    }

    setTitulo(evento) {
        this.setState({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setState({ preco: evento.target.value });
    }

    setAutorId(evento) {
        this.setState({ autorId: evento.target.value });
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

                    <InputCustomizado id="titulo" label="Titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo.bind(this)} />
                    <InputCustomizado id="preco" label="Preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco.bind(this)} />

                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId.bind(this)}>
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

class TabelaLivros extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((livro) => {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}

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



