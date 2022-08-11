class Tabs {
    constructor(container) {
        this.container = container,
        this.tabs = container.querySelectorAll('.tab-btn')
    }
    init() {
        this.tabs.forEach(tab => { 
            tab.addEventListener('click', event => {
                this.toggleTabs(event);
                this.toggleContent(event);
        });});
    }
    toggleTabs(event) {
        //remove selected class
        this.tabs.forEach(tab => tab.classList.remove('selected'));
        //add selected class to the clicked tab
        event.target.closest('li').classList.add('selected');
    }
    toggleContent(event) {
        //add hidden class to contents
        document.querySelectorAll('.column').forEach(content => {
            content.classList.add('is-hidden-touch');
        });
        //remove said class to the selected tab content
        const tabId = event.target.closest('li').getAttribute('data-target');
        document.getElementById(tabId).classList.remove('is-hidden-touch');
    }
}

export { Tabs as default };