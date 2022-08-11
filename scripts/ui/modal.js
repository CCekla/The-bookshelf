class Modal {
    constructor(modal) {
        this.modal = modal,
        this.form,
        this.inputs,
        this.closeBtns = modal.querySelectorAll('.closing')
    }

    init() {
        this.closeBtns.forEach(btn => btn.addEventListener('click', () => {
            this.close();
        }));
        if(this.modal.querySelector('form')){
            this.form = this.modal.querySelector('form');
            this.inputs = this.form.querySelectorAll('input[type=text]');

            this.inputs.forEach(input => input.addEventListener('keyup', event => {
                // regex test pattern
                const pattern = /[a-zA-Z]{2,}/;

                if (pattern.test(event.target.value.trim())) {
                    //green
                    event.target.setAttribute("class", "input has-background-success-light");
                } else {
                    //red
                    event.target.setAttribute("class", "input has-background-danger-light");
                }
            }));
        }
        
    }

    close() {
        if(this.form) {
            this.clearForm();
        }
        this.modal.classList.toggle('is-active');
    }

    open() {
        this.modal.classList.toggle('is-active');
    }

    clearForm() {
        //reset form values
        this.form.reset();
        //reset input aspect
        this.inputs.forEach(input => input.setAttribute('class','input'));
    }

    checkFields() {
        return (!this.form.bookTitle.classList.contains("has-background-danger-light") &&
        !this.form.bookAuthor.classList.contains("has-background-danger-light"))
    }

    feedback() {
        
    }
}

export { Modal as default }