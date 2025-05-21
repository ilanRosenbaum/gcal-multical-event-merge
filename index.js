window.onload = function () {

    const getDisabled = () => new Promise(res => chrome.storage.local.get('disabled', (s) => res(s.disabled)));
    const getStyle = () => new Promise(res => chrome.storage.local.get('style', (s) => res(s.style)));
    const getWildcard = () => new Promise(res => chrome.storage.local.get('wildcard', (s) => res(s.wildcard)));
    const getIgnoreDetails = () => new Promise(res => chrome.storage.local.get('ignoreDetails', (s) => res(s.ignoreDetails))); // New getter

    const setIcon = (disabled) => chrome.action.setIcon({
        path: disabled ? "icon-disabled.png" : "icon.png"
    });

    const setDropdown = (id, value) => {
        let element = document.getElementById(id);
        element.value = value;
    }

    const setToggle = (id, value) => {
        let element = document.getElementById(id);
        element.checked = value
    }

    const setText = (id, value) => {
        let element = document.getElementById(id);
        element.value = value
    }

    getDisabled().then(disabled => {
        if (disabled == null) {
            disabled = false
            chrome.storage.local.set({ 'disabled': disabled });
        }
        setToggle('toggle_enabled',!disabled)
    });
    getStyle().then(value => {
        if (value == null) {
            value = 'vertical_bands'
            chrome.storage.local.set({ 'style': value });
        }
        setDropdown('select_style',value)
    });

    getWildcard().then(value => {
        if (value == null) {
            value = 'busy'
            chrome.storage.local.set({ 'wildcard': value });
        }
        setText('wildcard_value',value)
    });

    getIgnoreDetails().then(value => { // Initialize new setting
        if (value == null) {
            value = false; // Default to false
            chrome.storage.local.set({ 'ignoreDetails': value });
        }
        setToggle('toggle_ignore_details', value);
    });

    const manifest_data = chrome.runtime.getManifest();
    document.getElementById('version').innerHTML=`V${manifest_data.version}`

    document.getElementById('toggle_enabled').onclick = function () {
        getDisabled().then(disabled => {
            chrome.storage.local.set({ 'disabled': !disabled });
            setIcon(!disabled);
        })
    };

    document.getElementById('select_style').onchange = function (e) {
        chrome.storage.local.set({ 'style': e.target.value });
    };

    document.getElementById('wildcard_value').onchange = function (e) {
        if (e.target.value.length < 3 && e.target.value !== '') return alert('wildcard too short, you are going to get problems. If you do not want wildcard matching make this textbox blank')
        chrome.storage.local.set({ 'wildcard': e.target.value });
    };

    document.getElementById('toggle_ignore_details').onclick = function () { // Handle click for new toggle
        getIgnoreDetails().then(currentVal => {
            chrome.storage.local.set({ 'ignoreDetails': !currentVal });
        });
    };
}