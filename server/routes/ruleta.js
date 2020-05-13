// CRUD ruletas
const _ = require('underscore');
const express = require('express');
const Ruleta = require('../models/ruleta');
const Apuesta = require('../models/apuesta');

const app = express();

// Crea ruleta
app.post('/ruleta', (req, res) => {
    
    let ruleta = new Ruleta();
    let apuesta = new Apuesta
    ruleta.save((err, field) => {
        if(err){
            return res.status(400).json({
                status: false,
                data: err
            });
        }

        return res.json({
            status: true,
            data: field._id
        });
    });
});

// Abre una ruleta
app.put('/ruleta/:id/abrir', (req, res) => {
    let idRuleta = req.params.id;
    Ruleta.findOneAndUpdate(
        { _id: idRuleta, estado: 'creada' },
        { estado: 'abierta', fechaApertura: new Date() },
        { new: true },
        (err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: false,
                    data: err
                });
            }
            
            if(field === null){
                return res.json({
                    status: false,
                    data: 'La ruleta solicitada no existe, está abierta o ya fue cerrada'
                });
            }

            return res.json({
                status: true,
                data: `La ruleta ${field._id} fue abierta.`
            });
        }
    );
});

// Crea una apuesta en una ruleta
app.post('/ruleta/:id/crear/apuesta', (req, res) => {
    let idRuleta = req.params.id;
    let idUsuario = req.headers.authorization;
    let { numero, color, dinero } = req.body;

    let apuesta = new Apuesta(idUsuario, numero, color, dinero);

    // Validaciones de la apuesta
    let validacion = apuesta.validarApuesta();
    if(!validacion.validado){
        return res.status(400).json({
            status: false,
            data: validacion.mensaje
        });
    }

    Ruleta.findOneAndUpdate(
        { _id: idRuleta, estado: "abierta" },
        { $push: { "apuestas": apuesta } },
        { new: true },
        (err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: false,
                    data: err
                });
            }

            if(field === null){
                return res.json({
                    status: false,
                    data: 'La ruleta solicitada no existe, está cerrada o no ha sido abierta'
                });
            }

            return res.json({
                status: true,
                data: 'La apuesta fue agregada con exito'
            })
        }
    );
});

// Cierra una ruleta
app.delete('/ruleta/:id', (req, res) => {
    let idRuleta = req.params.id;
    Ruleta.findOneAndUpdate(
        { _id: idRuleta, estado: 'abierta' },
        { estado: 'cerrada', fechaClausura: new Date() },
        { new: true },
        (err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: false,
                    data: err
                });
            }
            
            if(field === null){
                return res.json({
                    status: false,
                    data: 'La ruleta solicitada no existe, ya fue cerrada o no ha sido abierta'
                });
            }

            return res.json({
                status: true,
                data: `La ruleta ${field._id} fue cerrada.`
            });
        }
    );
});

// Obtiene las ruletas
app.get('/ruletas', (req, res) => {
    Ruleta.find({})
        .exec((err, fields) => {
            if(err){ 
                return res.status(400).json({
                    status: false,
                    data: err
                });
            }

            if(fields.length == 0){
                return res.json({
                    status: true,
                    data: []
                });
            }

            let ruletasFiltradas = fields.map( item => {
                return {
                    "id": item._id,
                    "estado": item.estado,
                    "fechaCreacion": item.fechaCreacion,
                    "fechaApertura": item.fechaApertura,
                    "fechaClausura": item.fechaClausura
                }
            });

            return res.json({
                status: true,
                data: ruletasFiltradas
            });
    });
});

// Obtiene una ruleta
app.get('/ruleta/:id', (req, res) => {
    let idRuleta = req.params.id;

    Ruleta.findById(idRuleta)
        .exec((err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: false,
                    data: err
                });
            }

            if(field === null){
                return res.json({
                    status: false,
                    data: 'La ruleta solicitada no existe.'
                });
            }

            let ruletaFiltrada =  {
                "id": field._id,
                "estado": field.estado,
                "fechaCreacion": field.fechaCreacion,
                "fechaApertura": field.fechaApertura,
                "fechaClausura": field.fechaClausura
            }

            return res.json({
                status: true,
                data: ruletaFiltrada
            });
    });
});

module.exports = app;