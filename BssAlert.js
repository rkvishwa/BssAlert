const icons = {
    success: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 bg-white text-green-600 rounded-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
        </svg>`,
    error: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 bg-white text-red-600 rounded-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
        </svg>`,
    info: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 bg-white text-blue-600 rounded-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
        </svg>`
    };

const colors = {
    success: "green",
    error: "red",
    info: "blue"
};

const TailAlert = {
    show({icon:iconType, button, buttons, title, body}){
        const iconSvg = icons[iconType] || icons.error;
        const color = colors[iconType] || colors.error;

        if(button && button.length > 0){
            this.buttonNames = ['', String(button)]
        }else{
            if(buttons && buttons.length > 1){
                this.buttonNames = [...buttons]
            }else if(buttons && buttons.length === 1){
                this.buttonNames = [...buttons, 'Cancel']
            }else if(buttons && buttons.length === 0){
                this.buttonNames = ['Confirm', 'Cancel']
            }else{
                this.buttonNames = ['','Close']
            }
        }
        
        if(document.querySelector("tail-alert")){
            document.querySelector("tail-alert").remove();
        }

        this.alertContainer = document.createElement("tail-alert");

        this.alertContainer.className = "fixed w-[95%] max-w-[500px] z-50 bg-white top-1/4 left-1/2 translate-x-[-50%] shadow border-gray-300 rounded-xl overflow-hidden translate-y-[-50vh] hidden transition duration-700";
        this.alertContainer.id = `alert-container-${Math.floor(Date.now() / 1000)}`;
        this.alertContainer.innerHTML = `
            <div class="bg-white rounded-lg">
                <div class="w-full border-t-8 border-${color}-600 rounded-lg flex flex-col px-8 py-6">
                <div class="w-full flex items-center justify-start gap-6" id="alert-icon">
                    <span>${iconSvg}</span>
                    <h3 class="font-extrabold text-${color}-700 font-nunito text-xl" id="alert-title">${title || ""}</h3>
                </div>
                <div class="w-full pr-4">
                    <p class="pt-4 text-sm text-gray-600 font-nunito" id="alert-body">${body || ""}</p>
                </div>
                </div>
                <div class="p-4 pt-0 flex justify-end space-x-2">
                ${buttons ? 
                `<button id="tail-alert-confirm" class="${buttons ? 'w-fit px-8 bg-white hover:bg-gray-200 hover:border-gray-200' : 'w-1/2 px-4 bg-gray-200 hover:text-gray-700 hover:bg-gray-300 hover:border-gray-300'} min-w-32 border-2 border-gray-200 py-3 text-center text-gray-500 font-bold duration-300 rounded-lg text-sm font-nunito">${this.buttonNames[0]}</button>` : ''}

                <button id="tail-alert-close" class="w-fit min-w-32 px-8 py-3 text-center bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-bold rounded-lg text-sm font-nunito duration-300">${this.buttonNames[1]}</button>
                </div>
            </div>
            `;

        document.body.appendChild(this.alertContainer);
        this.closeButton = document.getElementById("tail-alert-close");

        if(buttons){
            this.confirmButton = document.getElementById("tail-alert-confirm");
            this.promise = new Promise((resolve, reject) => {
                this.closeButton.onclick = () => {
                    this.hideAlert(this.alertContainer)
                    resolve(false)
                    this.closeButton.onclick = null
                    this.confirmButton.onclick = null
                }
                this.confirmButton.onclick = () => {
                    this.hideAlert(this.alertContainer)
                    resolve(true)
                    this.closeButton.onclick = null
                    this.confirmButton.onclick = null
                }
            })
        }else{
            this.promise = new Promise((resolve, reject) => {
                this.closeButton.onclick = () => {
                    this.hideAlert(this.alertContainer)
                    resolve(false)
                    this.closeButton.onclick = null
                }
            })
        }

        this.showAlert()
        return this.promise

    },

    showAlert() {
        this.alertContainer.classList.remove("hidden")
        setTimeout(() => {
            this.alertContainer.classList.add("!translate-y-[-50%]")
        },1)
    },

    hideAlert(container) {
        this.alertContainer.classList.remove("!translate-y-[-50%]")
        setTimeout((container) => {
            container.classList.add("hidden")
            container.remove()
        },500, container)
    }
}