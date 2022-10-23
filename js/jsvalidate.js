class JSValidator {
    status = true;
    errors = []
    via = 'http'
    msg = {
        required: `Este campo es requerido`,
        minLength: `Longitud no válida. Mínimo ${this.validators.minLength} caracteres`,
        maxLength: `Longitud no válida. Máximo ${this.validators.maxLength} caracteres`,
        email: `El campo de email no es válido`,
        integer: `El campo debe ser de tipo entero`,
        digit: `El valor debe ser un dígito`,
        url: `El campo debe ser una URL válida`
    }
    constructor(formId) {
        this.setForm(formId);
        this.setInputs();
        this.parseInputs();
        // this.validateForm();

    }
    setAjax() {
        this.via = 'ajax'
        //retorna el mismo formulario para concatenar mas metodos

        return this;
    }
    setHttp() {
        this.via = 'http'
        //retorna el mismo formulario para concatenar mas metodos

        return this;
    }
    setForm(formId) {
        this.form = document.getElementById(formId);
    }
    setInputs() {
        this.inputs = document.querySelectorAll(`#${this.form.id} .jsvalidate`)
    }
    parseInputs() {
        this.inputs.forEach(input => {
            this.appendErrorTag(input);
        })
    }
    appendErrorTag(input) {
        let parent = input.parentNode;
        let span = document.createElement('span');
        span.setAttribute('class', 'error-msg');
        parent.appendChild(span);
    }
    validateForm() {
        this.form.addEventListener('submit', (e) => {
            this.resetValidation();
            console.log(`Cantidad de input: ${this.inputs.length}`)
            console.log(this.inputs)


            this.inputs.forEach(input => {
                console.log(`PASANDO:  ${input.id}: valor ${input.value}`)


                this.validateInput(input);
            })
            if (!this.status) {
                //prevenir el envio del formulario
                e.preventDefault();
                console.log('ERROR: Ha ocurrido un error de validación')
            } else {
                if (this.via == 'ajax') {
                    e.preventDefault();
                    this.submitHandler()
                    console.log('Se ha enviado por AJAX')


                } else {
                    // Solo para fines demostrativos
                    e.preventDefault();
                    console.log('Formulario enviado')

                }
            }
        })
    }
    validateInputs() {
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(input)
            })
        })
    }
    validateInput(input) {
        let validators = input.dataset.validators;
        if (validators !== undefined) {
            validators = validators.split(' ');
            validators.forEach(validator => {
                console.log(`Nombre de req ${validator}`)
                this[`_${validator}`](input);

            })
        }
    }
    setError(input, msg) {
        this.status = false;
        this.setStackError(input, msg);
        this.setErrorMessage(input, msg);
    }
    setStackError(input, msg) {
        this.errors.push({ input: input, msg: msg })
    }
    setErrorMessage(input, msg) {
        let span = input.nextElementSibling;
        span.innerHTML += (msg + '<br />')
    }
    resetValidation() {
        this.status = true;
        this.resetStackError();
        this.resetErrorMessages();
    }
    resetStackError() {
        this.errors = [];
    }
    resetErrorMessages() {
        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`)
        spans.forEach(span => {
            span.innerHTML = "";
        })
    }
    init() {
        this.validateForm();
        this.validateInputs();
        //retorna el mismo formulario para concatenar mas metodos
        return this;
    }
    submitHandler() {
        let data = new FormData(this.form);

        fetch(this.form.action, {
            method: this.form.method,
            body: data
        })
            .then(response => response.json())
            .then(data => {

                console.log(data)

            })
            .catch(error => {

                console.error(error)

            });

    }
}

JSValidator.prototype._required = function (input) {
    let value = input.value;
    let msg = this.msg.required;
    console.log(value.trim())
    console.log(`Input ${input.id}: valor ${input.value}`)

    if (value.trim() === "" || value.length < 1) {
        this.setError(input, msg);
    }
}
JSValidator.prototype._length = function (input) {
    // console.warn('Se esta validado un input para leng')
}