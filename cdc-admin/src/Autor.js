import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
        
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
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

                    <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                    <InputCustomizado id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
                    <InputCustomizado id="senha" label="Senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((autor) => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
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