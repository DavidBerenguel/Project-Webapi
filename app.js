const mongoose = require('mongoose')
const mongooseQueryString = "mongodb://localhost:27017/projeto_funcionario";
const funcionarioSchema = new mongoose.Schema({
    nome: {type:String, require: true}, 
    funcionario: {type:Number, require: true}, 
    data_inicio: {type: Date, require: true}, 
    data_fim: {type: Date, require: true}, 
    matricula: {type: String, require: true}, 
    km_percorrido: {type: Number, require: true} 
    });
const funcionarioModel = mongoose.model("funcionarios", funcionarioSchema);
mongoose.connect(mongooseQueryString);

const express = require('express');
const app = express();
const port = 8080;

app.use((request, response, next) => {
    console.log(`Foi afetuado um pedido de ${request.method} ao url ${request.url}`);
    next();
});

app.use(express.json());

app.listen(port, () => {console.log("running on port 120.0.0.1:" + port)});


/*-------------------------------------------------------------------------------------------------*/


//Mostrar todos
async function queryAllFuncionario() {
    try{
        let queryAllFuncionarioResults = await funcionarioModel.find();
        return queryAllFuncionarioResults;
    }
    catch(err) {
        console.log(err);
        return[];
    }
}
app.get("/funcionario", async function(request,response) {
    try {
        const result = await queryAllFuncionario();
        response.status(200).json(result);
    } catch(err) {
        response.status(500).json({message: err.message})
    }
    
});

//Mostrar só um por id
async function queryFuncionario(request, response, next) {
    let funcionarioResult
    try{
        funcionarioResult = await funcionarioModel.findById(request.params.id);
        if(funcionarioResult == null) {
            return response.status(404).json({message: "Não foi encontrado nenhum funcionario com este ID"});
        }
    }
    catch (err) {
        return response.status(500).json({message: err.message});
    }

    request.funcionarioResult = funcionarioResult
    
    next()
}
app.get("/funcionario/:id", queryFuncionario, async function(request,response) {
    response.status(201).send(request.funcionarioResult);
    
});

//Mostrar só um por matricula
async function queryMatricula(request, response, next) {
    let matriculaResult
    try{
        matriculaResult = await funcionarioModel.find({matricula: request.params.matricula});
        if(matriculaResult == null) {
            return response.status(404).json({message: "A matricula solicitada não foi encontrada"});
        }
    }
    catch (err) {
        return response.status(500).json({message: err.message});
    }

    request.matriculaResult = matriculaResult
    
    next();
}

app.get("/funcionario/matricula/:matricula", queryMatricula, async function(request,response) {
    response.status(201).send(request.matriculaResult);
    
});

//Criar novo
app.post("/funcionario", async function(request, response) {
    const novoFuncionario = new funcionarioModel({
        Nome: request.body.nome,
        Funcionario: request.body.funcionario,
        Inicio: request.body.data_inicio,
        Fim: request.body.data_fim,
        Matricula: request.body.matricula,
        Kms_Percorridos: request.body.km_percorridos
    });
    try {
        await novoFuncionario.save();
        response.status(201).json(novoFuncionario);
    }catch(err) {
        response.status(400).json({message: err.message});
    }
    
});

//Editar
app.patch("/funcionario/:id", async function(request, response) {
    try{
        const{id} = request.params;

        const funcionario = await funcionarioModel.findByIdAndUpdate(id, request.body);

        if(!funcionario) {
            return response.status(404).json({message: "Funcionario não encontrado"});
        }

        const updateFuncionario = await funcionarioModel.findById(id);
        response.status(200).json(updateFuncionario)
    }
    catch(err){
        response.status(500).json({message: err.message});
    }
});

//Eliminar
app.delete("/funcionario/:id", async function(request, response) {

});