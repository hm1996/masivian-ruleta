class Apuesta{
    constructor(usuario, numero, color, dinero){
        this.usuario = usuario;
        this.numero = Number(numero);
        this.color = color;
        this.dinero = Number(dinero);
    }

    validarApuesta(){
        if(isNaN(this.numero)){
            return { validado: false, mensaje: 'El this.numero es invalido' };
        }else if(this.numero > 36 || this.numero < -1){
            return { validado: false, mensaje: 'El this.numero debe estar entre -1 y 36' };
        }

        if(isNaN(this.dinero)){
            return { validado: false, mensaje: 'El valor de la apuesta es invalido' };
        }else if(this.dinero > 10000 || this.dinero < 0){
            return { validado: false, mensaje: 'El valor de la apuesta debe estar entre 0 y 10000' };
        }

        if(this.color !== "negro" && this.color !== "rojo"){
            return { validado: false, mensaje: 'El color debe ser rojo o negro' };
        }

        return { validado: true, mensaje: '' };
    }
}

module.exports = Apuesta;